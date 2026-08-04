import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft, Upload, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Line } from 'recharts';
import { LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function GPSVerifier() {
  const [preBatteryData, setPreBatteryData] = useState([]);
  const [postBatteryData, setPostBatteryData] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const preInputRef = useRef(null);
  const postInputRef = useRef(null);

  const processFiles = async (files) => {
    if (!files || files.length === 0) return [];
    
    const results = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        // Dynamic import of exifr
        const exifr = await import('https://cdn.jsdelivr.net/npm/exifr/dist/lite.esm.js');
        const tags = await exifr.parse(file, { xmp: true, tiff: true });
        
        let abs, rel, time;
        
        if (tags) {
          abs = tags.drone?.dji?.AbsoluteAltitude ?? tags.AbsoluteAltitude;
          rel = tags.drone?.dji?.RelativeAltitude ?? tags.RelativeAltitude;
          
          if (abs === undefined && tags.XMP) {
            abs = tags.XMP.drone?.dji?.AbsoluteAltitude || tags.XMP.droneDji?.AbsoluteAltitude;
            rel = tags.XMP.drone?.dji?.RelativeAltitude || tags.XMP.droneDji?.RelativeAltitude;
          }
        }
        
        time = tags?.DateTimeOriginal ? new Date(tags.DateTimeOriginal) : new Date(file.lastModified);
        
        if (abs !== undefined && rel !== undefined) {
          results.push({
            name: file.name,
            abs: parseFloat(abs),
            rel: parseFloat(rel),
            diff: Math.round((abs - rel) * 100) / 100,
            time: time
          });
        }
      } catch (err) {
        console.error(`Error processing ${file.name}:`, err);
      }
    }
    
    return results.sort((a, b) => a.time - b.time);
  };

  const handleFileSelect = async (e, segment) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setIsProcessing(true);
    setError('');

    try {
      const data = await processFiles(files);
      
      if (data.length === 0) {
        setError('No valid GPS altitude data found in the selected images. Please ensure you are using images from a DJI drone with EXIF data.');
        setIsProcessing(false);
        return;
      }

      if (segment === 'pre') {
        setPreBatteryData(data);
      } else {
        setPostBatteryData(data);
      }
    } catch (err) {
      setError('Error processing files. Please try again.');
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const allData = [...preBatteryData, ...postBatteryData];
  const hasData = allData.length > 0;

  const finalShift = hasData && preBatteryData.length > 0 && postBatteryData.length > 0
    ? Math.abs(postBatteryData[0].diff - preBatteryData[preBatteryData.length - 1].diff)
    : 0;

  const getStatus = () => {
    if (finalShift < 0.5) {
      return {
        label: 'OK',
        message: 'Altitude / Z-Axis GPS data appears to be in tolerance',
        color: 'bg-green-500/20 border-green-500 text-green-400',
        badgeColor: 'bg-green-500 text-white'
      };
    } else if (finalShift < 4.0) {
      return {
        label: 'Caution',
        message: 'Moderate altitude shift detected',
        color: 'bg-yellow-500/20 border-yellow-500 text-yellow-400',
        badgeColor: 'bg-yellow-500 text-white'
      };
    } else {
      return {
        label: 'Warning',
        message: 'Critical altitude shift detected. GPS data integrity is compromised. Correct drone stabilization needed.',
        color: 'bg-red-500/20 border-red-500 text-red-400',
        badgeColor: 'bg-red-500 text-white'
      };
    }
  };

  const status = getStatus();

  const chartData = allData.map((item, idx) => ({
    index: idx + 1,
    name: item.name.substring(0, 15),
    absolute: item.abs,
    relative: item.rel,
    difference: item.diff,
    segment: preBatteryData.includes(item) ? 'Pre-Battery' : 'Post-Battery'
  }));

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white">
      <div className="max-w-4xl mx-auto px-5 py-8 pb-20">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link to={createPageUrl('ToolsLinks')}>
            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-slate-800">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">GPS Altitude Verifier</h1>
            <p className="text-sm text-slate-400">Check altitude data consistency across battery changes</p>
          </div>
        </div>

        {/* Important Notice */}
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 mb-6">
          <div className="flex gap-3">
            <AlertTriangle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-300 space-y-1">
              <p className="font-semibold">Important Limitation:</p>
              <p>This tool only analyzes <strong>vertical (Z-Axis) altitude</strong> shifts. It cannot detect horizontal (X/Y position) GPS drift. Therefore, a passing result here does not guarantee successful processing of the image set.</p>
            </div>
          </div>
        </div>

        {/* Upload Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div>
            <h3 className="text-lg font-semibold mb-3">Segment A (Pre-Battery)</h3>
            <label className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-600 rounded-xl bg-slate-800/30 hover:bg-slate-800/50 cursor-pointer transition-all">
              <Upload className="w-10 h-10 text-blue-400 mb-2" />
              <span className="text-sm font-medium text-slate-300">Upload photos before swap</span>
              <span className="text-xs text-slate-500 mt-1">{preBatteryData.length} images</span>
              <input
                ref={preInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => handleFileSelect(e, 'pre')}
                className="hidden"
              />
            </label>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Segment B (Post-Battery)</h3>
            <label className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-600 rounded-xl bg-slate-800/30 hover:bg-slate-800/50 cursor-pointer transition-all">
              <Upload className="w-10 h-10 text-purple-400 mb-2" />
              <span className="text-sm font-medium text-slate-300">Upload photos after swap</span>
              <span className="text-xs text-slate-500 mt-1">{postBatteryData.length} images</span>
              <input
                ref={postInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => handleFileSelect(e, 'post')}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Processing Indicator */}
        {isProcessing && (
          <div className="text-center py-8">
            <div className="inline-block w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-slate-400">Analyzing EXIF data...</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6">
            <p className="text-sm text-red-300">{error}</p>
          </div>
        )}

        {/* Results */}
        {hasData && !isProcessing && (
          <div className="space-y-6">
            {/* Status Card */}
            {preBatteryData.length > 0 && postBatteryData.length > 0 && (
              <div className={`p-6 rounded-xl border-2 ${status.color}`}>
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="text-center md:text-left">
                    <p className="text-xs uppercase font-bold opacity-70 mb-1">Final Altitude Shift</p>
                    <p className="text-4xl font-bold">{finalShift.toFixed(2)}m</p>
                  </div>
                  <div className="flex flex-col items-center md:items-end">
                    <div className={`px-4 py-1 rounded-full text-sm font-bold uppercase ${status.badgeColor} mb-2`}>
                      {status.label}
                    </div>
                    <p className="text-sm max-w-xs text-center md:text-right">{status.message}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Chart */}
            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="index" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
                    labelStyle={{ color: '#e2e8f0' }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="absolute" stroke="#3b82f6" name="Absolute (AMSL)" strokeWidth={2} />
                  <Line type="monotone" dataKey="relative" stroke="#8b5cf6" name="Relative (AGL)" strokeWidth={2} />
                  <Line type="monotone" dataKey="difference" stroke="#10b981" name="Difference" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Data Table */}
            <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-900/50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-bold text-slate-400 uppercase">Image</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-slate-400 uppercase">Absolute</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-slate-400 uppercase">Relative</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-slate-400 uppercase">Diff</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-slate-400 uppercase">Segment</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700">
                    {allData.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-700/30">
                        <td className="px-4 py-3 text-sm">{item.name}</td>
                        <td className="px-4 py-3 text-sm">{item.abs.toFixed(2)}m</td>
                        <td className="px-4 py-3 text-sm">{item.rel.toFixed(2)}m</td>
                        <td className="px-4 py-3 text-sm font-semibold">{item.diff.toFixed(2)}m</td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            preBatteryData.includes(item) 
                              ? 'bg-blue-500/20 text-blue-300' 
                              : 'bg-purple-500/20 text-purple-300'
                          }`}>
                            {preBatteryData.includes(item) ? 'Pre' : 'Post'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        {!hasData && !isProcessing && (
          <div className="bg-slate-800/30 rounded-xl p-6 border border-slate-700">
            <h3 className="font-semibold mb-3">How to Use:</h3>
            <ol className="space-y-2 text-sm text-slate-300">
              <li>1. Upload images captured <strong>before</strong> the battery change to Segment A</li>
              <li>2. Upload images captured <strong>after</strong> the battery change to Segment B</li>
              <li>3. Review the altitude shift analysis and status indicator</li>
              <li>4. Remember: This only checks altitude (Z-Axis). Always verify tower centering visually.</li>
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}