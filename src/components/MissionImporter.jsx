import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { base44 } from '@/api/base44Client';
import { Loader2, Upload, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function MissionImporter({ onComplete }) {
  const [jsonInput, setJsonInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);

  const parseCaptureTime = (captureTimeStr) => {
    if (!captureTimeStr) return null;
    try {
      // Format: "Thursday 3 Oct 2024, 12:16:17 pm"
      const cleaned = captureTimeStr.replace(/,/g, '');
      const parts = cleaned.split(' ');
      const day = parseInt(parts[1]);
      const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].indexOf(parts[2]);
      const year = parseInt(parts[3]);
      const time = parts[4];
      const ampm = parts[5];
      
      const [hours, minutes, seconds] = time.split(':').map(Number);
      let hour24 = hours;
      if (ampm === 'pm' && hours !== 12) hour24 += 12;
      if (ampm === 'am' && hours === 12) hour24 = 0;
      
      return new Date(year, month, day, hour24, minutes, seconds).toISOString();
    } catch (e) {
      console.error('Failed to parse capture time:', captureTimeStr, e);
      return null;
    }
  };

  const handleImport = async () => {
    setIsProcessing(true);
    setResult(null);

    try {
      const missions = JSON.parse(jsonInput);
      const imported = [];
      const failed = [];

      for (const mission of missions) {
        try {
          const metadata = mission.metadata || {};
          const site = mission.site || {};
          const captureTimestamp = parseCaptureTime(metadata.captureTime);

          // Extract location code from site name (e.g., "F00899-B07 - ABUCAY" -> "F00899-B07")
          const locationCode = site.name ? site.name.split(' - ')[0] : null;
          const siteName = site.name ? site.name.split(' - ')[1] : site.name;

          // Determine outcome based on status
          const rawStatus = mission.status || 'UNKNOWN';
          const outcome = rawStatus === 'COMPLETE' ? 'SUCCESS' : 
                         rawStatus === 'FAILED' ? 'FAILURE' : 
                         null;

          if (!outcome) {
            failed.push({ mission_id: mission.id, reason: 'Unknown status: ' + rawStatus });
            continue;
          }

          const missionData = {
            mission_id: mission.id,
            client_name: mission.client?.name,
            site_name: siteName,
            site_id: site.id,
            location_code: locationCode,
            raw_status: rawStatus,
            outcome: outcome,
            capture_timestamp: captureTimestamp,
            status_changed_at: metadata.azureStatusChanged,
            drone_make: metadata.make,
            drone_model: metadata.model,
            image_size: metadata.imageSize,
            number_of_files: metadata.numberOfFiles,
            raw_metadata: JSON.stringify(metadata),
            data_source: 'imported',
            is_locked: true,
            pilot_group: 'QNSI'
          };

          await base44.entities.Mission.create(missionData);
          imported.push(mission.id);
        } catch (error) {
          failed.push({ mission_id: mission.id, reason: error.message });
        }
      }

      setResult({ imported: imported.length, failed: failed.length, details: failed });
      if (onComplete) onComplete();
    } catch (error) {
      setResult({ error: error.message });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 text-sm">
        <p className="font-semibold text-blue-300 mb-1">Import QNSI Mission Data</p>
        <p className="text-xs text-blue-400">
          Paste the JSON array of missions. Each will be parsed and stored with capture_timestamp, 
          metadata, and location data extracted automatically.
        </p>
      </div>

      <Textarea
        value={jsonInput}
        onChange={(e) => setJsonInput(e.target.value)}
        placeholder='[{"id":"job-07272","status":"COMPLETE","metadata":{...},"site":{...}}, ...]'
        className="bg-slate-900/50 border-slate-700 min-h-[200px] font-mono text-xs"
      />

      <Button
        onClick={handleImport}
        disabled={isProcessing || !jsonInput}
        className="w-full bg-blue-500 hover:bg-blue-600"
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <Upload className="w-4 h-4 mr-2" />
            Import Missions
          </>
        )}
      </Button>

      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          {result.error ? (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
              <div className="flex items-center gap-2 text-red-400">
                <AlertTriangle className="w-4 h-4" />
                <p className="font-semibold">Import Failed</p>
              </div>
              <p className="text-sm text-red-300 mt-1">{result.error}</p>
            </div>
          ) : (
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4">
              <div className="flex items-center gap-2 text-emerald-400 mb-2">
                <CheckCircle2 className="w-4 h-4" />
                <p className="font-semibold">Import Complete</p>
              </div>
              <p className="text-sm text-emerald-300">
                ✓ Imported: {result.imported} missions
              </p>
              {result.failed > 0 && (
                <p className="text-sm text-amber-300 mt-1">
                  ⚠ Failed: {result.failed} missions
                </p>
              )}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}