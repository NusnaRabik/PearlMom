// frontend/src/pages/public/PrivacyPolicyPage.jsx
import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Lock, Eye, FileText, CheckCircle2, Mail, Heart } from 'lucide-react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

const PrivacyPolicyPage = () => {
  const heroRef = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 25, stiffness: 200 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleMouseMove = (e) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  };

  return (
    <div className="flex-grow">
      {/* Header Banner - Matching Landing & Help Hero */}
      <section 
        ref={heroRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => { mouseX.set(0); mouseY.set(0); }}
        className="relative pt-28 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-pink-50 via-white to-rose-50 border-b border-pink-100 overflow-hidden"
      >
        {/* Soft Animated Background Orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 w-96 h-96 bg-pink-200 rounded-full opacity-30 blur-3xl animate-pulse" />
          <div className="absolute bottom-10 right-10 w-[30rem] h-[30rem] bg-purple-200 rounded-full opacity-20 blur-3xl animate-pulse delay-1000" />

          <motion.div
            className="absolute w-[32rem] h-[32rem] bg-gradient-to-br from-pink-400 via-rose-400 to-purple-400 rounded-full blur-3xl opacity-25"
            style={{
              left: useTransform(smoothMouseX, [-600, 600], ['15%', '55%']),
              top: useTransform(smoothMouseY, [-600, 600], ['20%', '65%']),
            }}
          />
        </div>

        <div className="relative max-w-4xl mx-auto text-center z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-pink-100 rounded-2xl mb-6 text-pink-600 shadow-sm"
          >
            <ShieldCheck className="w-8 h-8" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 tracking-tight mb-4"
          >
            Privacy Policy & Health Data Protection
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto mb-5"
          >
            Your trust and confidentiality are at the core of everything we do. Learn how PearlMom safeguards maternal health records and personal data.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="inline-block text-xs font-semibold uppercase tracking-wider text-pink-600 bg-pink-50 border border-pink-100 px-4 py-1.5 rounded-full"
          >
            Effective Date: January 2026 • Sri Lanka MOH Protocol Compliant
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200 space-y-10">
          
          {/* Summary Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 bg-gradient-to-br from-pink-50/60 to-rose-50/60 rounded-2xl border border-pink-100">
            <div className="flex items-start space-x-3">
              <Lock className="w-5 h-5 text-pink-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-slate-900">Encrypted Records</h4>
                <p className="text-xs text-slate-600 mt-0.5">All E-MCH data is encrypted in transit and at rest.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Eye className="w-5 h-5 text-pink-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-slate-900">Strict Access Control</h4>
                <p className="text-xs text-slate-600 mt-0.5">Only your assigned PHM and verified doctors can view records.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Heart className="w-5 h-5 text-pink-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-slate-900">Never Sold</h4>
                <p className="text-xs text-slate-600 mt-0.5">We never monetize, share, or sell your health information.</p>
              </div>
            </div>
          </div>

          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <span className="text-pink-600 text-sm font-mono bg-pink-50 px-2 py-0.5 rounded-md">01</span>
              Information We Collect
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              PearlMom collects information necessary to deliver clinical-grade maternal monitoring, appointment scheduling, and nutrition supplement delivery:
            </p>
            <ul className="space-y-2 text-sm text-slate-600 ml-4 list-disc">
              <li><strong>Personal Identifiers:</strong> Mother's name, NIC, date of birth, contact number, emergency contact, and address.</li>
              <li><strong>Clinical Pregnancy Records:</strong> Estimated Due Date (EDD), Last Menstrual Period (LMP), gestational age, blood pressure, BMI, blood group, and laboratory findings.</li>
              <li><strong>Vaccination & Growth Records:</strong> Immunization schedule dates, Tdap/Tetanus booster logs, and infant developmental milestones.</li>
              <li><strong>Nutrition & Thriposha Eligibility:</strong> Weight gain logs, supplement distribution receipts, and nutritional risk assessments.</li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <span className="text-pink-600 text-sm font-mono bg-pink-50 px-2 py-0.5 rounded-md">02</span>
              How We Use Your Health Data
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              We process health information exclusively to support your maternal care journey:
            </p>
            <div className="space-y-2 text-sm text-slate-600">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-pink-500 mt-1 flex-shrink-0" />
                <span>Facilitating communication and clinic visit management with your assigned Public Health Midwife (PHM) and MOH clinic.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-pink-500 mt-1 flex-shrink-0" />
                <span>Automating timely reminders for prenatal appointments and crucial vaccination doses.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-pink-500 mt-1 flex-shrink-0" />
                <span>Verifying and coordinating government-sponsored Thriposha distribution eligibility.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-pink-500 mt-1 flex-shrink-0" />
                <span>Providing intelligent health tips tailored to your specific trimester and clinical vitals.</span>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <span className="text-pink-600 text-sm font-mono bg-pink-50 px-2 py-0.5 rounded-md">03</span>
              Data Protection & Confidentiality
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              PearlMom implements stringent technological and operational safeguards designed to prevent unauthorized access or disclosure:
            </p>
            <ul className="space-y-2 text-sm text-slate-600 ml-4 list-disc">
              <li><strong>256-Bit SSL/TLS Encryption:</strong> All data transmissions between your browser and our servers are encrypted.</li>
              <li><strong>Role-Based Access Controls (RBAC):</strong> Only authorized healthcare providers assigned to your MOH area have access to your clinical records.</li>
              <li><strong>Audit Logging:</strong> Every record access and modification is logged for accountability and patient safety.</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <span className="text-pink-600 text-sm font-mono bg-pink-50 px-2 py-0.5 rounded-md">04</span>
              Your Rights as a Mother / Patient
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              You retain full ownership and control over your health information:
            </p>
            <ul className="space-y-2 text-sm text-slate-600 ml-4 list-disc">
              <li><strong>Digital E-MCH Export:</strong> Download and print your complete digital maternity record (PDF) at any time.</li>
              <li><strong>Correction of Records:</strong> Request corrections to inaccurate information via your assigned PHM or the in-app support center.</li>
              <li><strong>Account Deletion:</strong> Request account deactivation upon completion of postpartum care in compliance with medical record retention laws.</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="space-y-4 pt-4 border-t border-slate-100">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <span className="text-pink-600 text-sm font-mono bg-pink-50 px-2 py-0.5 rounded-md">05</span>
              Contact Our Privacy Officer
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              If you have any questions, concerns, or requests regarding this Privacy Policy or how your maternal data is handled, please reach out to us:
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="mailto:privacy@pearlmom.lk"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-medium transition-colors"
              >
                <Mail className="w-4 h-4 text-pink-600" />
                privacy@pearlmom.lk
              </a>
              <Link
                to="/help"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-pink-600 hover:bg-pink-700 text-white text-sm font-medium transition-colors shadow-sm"
              >
                <FileText className="w-4 h-4" />
                Help & Support Center
              </Link>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
};

export default PrivacyPolicyPage;
