import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, AlertTriangle, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';

export default function TermsAcceptance({ onAccept }) {
  const [agreed, setAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAccept = async () => {
    if (!agreed) return;
    
    setIsSubmitting(true);
    try {
      await base44.auth.updateMe({ terms_accepted: true, terms_accepted_date: new Date().toISOString() });
      onAccept();
    } catch (error) {
      console.error('Failed to update terms acceptance:', error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900 overflow-y-auto">
      <div className="min-h-screen flex items-center justify-center p-5">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-2xl bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-b border-slate-700 p-6">
            <div className="flex items-center gap-3 mb-2">
              <Shield className="w-8 h-8 text-blue-400" />
              <h1 className="text-2xl font-bold text-white">Terms of Use</h1>
            </div>
            <p className="text-slate-300">Pilot Companion App – Please read and accept to continue</p>
          </div>

          {/* Content */}
          <div className="p-6 max-h-[60vh] overflow-y-auto space-y-6 text-sm text-slate-300">
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
              <div className="flex gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <p className="text-amber-200">
                  By creating an account or using the Pilot Companion App, you agree to the following:
                </p>
              </div>
            </div>

            <section>
              <h3 className="font-bold text-white mb-2">1. Purpose of the App</h3>
              <p className="mb-2"><strong>a.</strong> The Pilot Companion App is a training and guidance tool only. It assists pilots with SiteSee capture practices, pre-flight preparation, and post-flight checks to help reduce the risk of capture failure.</p>
              <p><strong>b.</strong> All training content, prompts, and checks are guidance only and do not guarantee a successful flight, upload, or processing outcome.</p>
            </section>

            <section>
              <h3 className="font-bold text-white mb-2">2. Regulatory Compliance and Pilot Responsibility</h3>
              <p className="mb-2"><strong>a.</strong> You acknowledge that you are solely responsible for ensuring all drone operations conducted in connection with SiteSee captures comply with all applicable local, national, and international aviation laws, regulations, and safety standards.</p>
              <p className="mb-2"><strong>b.</strong> The app does not replace the pilot's duty of care, nor the obligation to comply with site-specific safety requirements, including (where applicable) rooftop access, working at heights, fall protection, exclusion zones, and general site safety protocols.</p>
              <p><strong>c.</strong> By using this app, you assume all operational and site-related risks associated with the flight and on-site activities.</p>
            </section>

            <section>
              <h3 className="font-bold text-white mb-2">3. Remote Pilot in Command (RPIC) Authority</h3>
              <p className="mb-2">The Remote Pilot in Command (RPIC) retains final authority and responsibility for:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Aircraft operation</li>
                <li>Flight safety</li>
                <li>Physical site safety</li>
              </ul>
              <p className="mt-2">SiteSee is not responsible for decisions made by the RPIC or for how guidance within the app is interpreted or applied in the field.</p>
            </section>

            <section>
              <h3 className="font-bold text-white mb-2">4. Third-Party Mission Planning (Scanlink by Dronelink)</h3>
              <p className="mb-2">The Pilot Companion App may reference or integrate with Scanlink, a mission planning product provided by Dronelink, which is a third-party service not owned, operated, or controlled by SiteSee.</p>
              <p className="mb-2">You acknowledge and agree that:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Your use of Scanlink is governed solely by Dronelink's own terms, conditions, and policies, which you are responsible for reviewing and accepting separately.</li>
                <li>SiteSee does not warrant or guarantee the performance, accuracy, reliability, or availability of Scanlink or any third-party mission planning software.</li>
                <li>Any mission planning, automation, or flight behaviour resulting from the use of ScanLink remains the sole responsibility of the pilot and RPIC.</li>
              </ul>
              <p className="mt-2">SiteSee shall not be liable for any loss, damage, injury, regulatory breach, failed capture, or processing failure arising from the use of, or reliance on, third-party software.</p>
            </section>

            <section>
              <h3 className="font-bold text-white mb-2">5. No Guarantee of Outcome</h3>
              <p className="mb-2">Completing all training steps, checks, or recommendations does not guarantee that:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>A flight will be successful</li>
                <li>Captured images will be suitable for processing</li>
                <li>A site will process successfully on the SiteSee platform</li>
              </ul>
              <p className="mt-2">Capture success depends on multiple factors outside SiteSee's control, including environmental conditions, equipment performance, GPS accuracy, third-party systems, and pilot execution.</p>
            </section>

            <section>
              <h3 className="font-bold text-white mb-2">6. Failed Sites and Re-Flight Responsibility</h3>
              <p>If a site fails processing for any reason, it is the customer's responsibility to re-fly the site. SiteSee has no responsibility or liability for the outcome of pilot capture or rework required.</p>
            </section>

            <section>
              <h3 className="font-bold text-white mb-2">7. No Warranty</h3>
              <p>The app and all associated guidance are provided "as is" and "as available", with no warranties or guarantees of accuracy, completeness, or fitness for purpose.</p>
            </section>

            <section>
              <h3 className="font-bold text-white mb-2">8. Limitation of Liability</h3>
              <p className="mb-2">To the maximum extent permitted by law, SiteSee shall not be liable for any:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Physical injury or property damage</li>
                <li>Regulatory or legal penalties</li>
                <li>Capture rework, delays, or losses</li>
              </ul>
              <p className="mt-2">arising from drone operations, on-site activities, or reliance on this app or its guidance.</p>
            </section>

            <section>
              <h3 className="font-bold text-white mb-2">9. Relationship to SiteSee Terms</h3>
              <p>By tapping "I Agree", you confirm that you have read, understood, and accepted these terms.</p>
            </section>
          </div>

          {/* Footer */}
          <div className="border-t border-slate-700 p-6 space-y-4">
            <label className="flex items-start gap-3 cursor-pointer group">
              <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                agreed 
                  ? 'bg-blue-500 border-blue-500' 
                  : 'border-slate-600 group-hover:border-slate-500'
              }`}>
                {agreed && <CheckCircle2 className="w-4 h-4 text-white" />}
              </div>
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="sr-only"
              />
              <span className="text-white font-medium">
                I have read, understood, and accept the Terms of Use
              </span>
            </label>

            <Button
              onClick={handleAccept}
              disabled={!agreed || isSubmitting}
              className="w-full bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Processing...' : 'I Agree - Continue to App'}
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}