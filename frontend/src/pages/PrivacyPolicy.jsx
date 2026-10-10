import { useState } from 'react';
import { FiCheck, FiCopy, FiDatabase, FiLock, FiMail, FiShield, FiTrash2 } from 'react-icons/fi';
import LegalLayout, { LegalSection } from '../components/LegalLayout';
import { Button } from '../components/ui';

const CONTACT_EMAIL = 'ihaajarcher@gmail.com';
const SUBJECT = 'Data Deletion Request';
const TEMPLATE = `Hello,

I want to permanently delete all my data from PrePost Analytics.

My account email is: [Your Email Here]
My username is: [Your Username Here]

Please confirm when my data has been deleted.

Thank you,
[Your Name]`;

const SECTIONS = [
  { id: 'data-collection', title: 'Data collection' },
  { id: 'youtube-api', title: 'YouTube API' },
  { id: 'encryption', title: 'Encryption' },
  { id: 'contact', title: 'Deletion & contact' },
];

function Bullets({ items }) {
  return (
    <ul className="space-y-2.5">
      {items.map((t) => (
        <li key={t} className="flex items-start gap-2.5">
          <FiCheck className="mt-1 h-4 w-4 shrink-0 text-brand-400" />
          <span>{t}</span>
        </li>
      ))}
    </ul>
  );
}

export default function PrivacyPolicy() {
  const [copied, setCopied] = useState(false);
  const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(SUBJECT)}&body=${encodeURIComponent(TEMPLATE)}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(`To: ${CONTACT_EMAIL}\nSubject: ${SUBJECT}\n\n${TEMPLATE}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* clipboard unavailable */ }
  };

  return (
    <LegalLayout
      eyebrow="Legal"
      title="Privacy Policy"
      intro="PrePost Analytics helps YouTube creators predict video performance using machine learning. This policy explains how we handle your data with transparency and respect for your privacy."
      sections={SECTIONS}
    >
      <blockquote className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 text-lg italic leading-relaxed text-ink-100">
        “Your data stays yours. We don't store your videos or personal content — we only analyze public YouTube data through their official API to provide predictions.”
      </blockquote>

      <LegalSection id="data-collection" title="Data collection">
        <p>To provide video performance predictions and channel analytics, we access the following data through YouTube's official API:</p>
        <Bullets items={[
          'Channel information (name, subscriber count, video count)',
          'Video metadata (title, description, thumbnail, category, duration)',
          'Public performance metrics (views, likes, comments, publish date)',
          'Account email and profile information (for authentication only)',
        ]} />
        <div className="flex gap-4 rounded-2xl border border-emerald-500/25 bg-emerald-500/[0.06] p-5">
          <FiDatabase className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
          <div>
            <p className="font-semibold text-white">No data storage</p>
            <p className="mt-1 text-sm text-ink-200">
              We do NOT store your videos, thumbnails, or channel data. All predictions are made in real-time using YouTube's public API.
              Only your account credentials (email, name) are stored for login purposes.
            </p>
          </div>
        </div>
      </LegalSection>

      <LegalSection id="youtube-api" title="YouTube API usage">
        <p>PrePost Analytics uses the official YouTube Data API. Our integration follows strict security guidelines:</p>
        <dl className="grid gap-3 sm:grid-cols-3">
          {[
            ['Zero password storage', 'We never ask for or store your YouTube password. All authentication is handled via secure OAuth tokens.'],
            ['Read-only access', 'By default, we only request "Read" permissions to analyze your content. We do not post or modify your account.'],
            ['Token expiry', 'Authentication tokens are refreshed frequently and stored in hardware-encrypted modules.'],
          ].map(([t, d]) => (
            <div key={t} className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">
              <dt className="text-sm font-semibold text-white">{t}</dt>
              <dd className="mt-1.5 text-sm text-ink-300">{d}</dd>
            </div>
          ))}
        </dl>
      </LegalSection>

      <LegalSection id="encryption" title="Privacy & encryption">
        <p>We treat your data with the same level of security required by financial institutions:</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { icon: FiLock, t: 'At rest', d: 'Data is encrypted using AES-256 standard with unique rotating keys for every database cluster.' },
            { icon: FiShield, t: 'In transit', d: 'All communication between your browser and our servers is secured via TLS 1.3 encryption.' },
          ].map(({ icon: Icon, t, d }) => (
            <div key={t} className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-5">
              <Icon className="h-5 w-5 text-brand-400" />
              <p className="mt-3 font-semibold text-white">{t}</p>
              <p className="mt-1.5 text-sm text-ink-300">{d}</p>
            </div>
          ))}
        </div>
      </LegalSection>

      <LegalSection id="contact" title="Deletion & contact">
        <div className="panel p-6">
          <div className="flex gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-brand-500/30 bg-brand-500/10 text-brand-400">
              <FiTrash2 className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Right to deletion</h3>
              <p className="mt-1 text-sm text-ink-300">Request immediate and permanent deletion of all account data at any time by emailing us.</p>
            </div>
          </div>

          <div className="mt-6 overflow-hidden rounded-xl border border-white/10 bg-ink-850">
            <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-2.5">
              <span className="font-mono text-xs text-ink-400">Email template</span>
              <button onClick={copy} className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-ink-200 hover:bg-white/[0.06] hover:text-white">
                {copied ? <><FiCheck className="h-3.5 w-3.5 text-emerald-400" /> Copied</> : <><FiCopy className="h-3.5 w-3.5" /> Copy</>}
              </button>
            </div>
            <pre className="whitespace-pre-wrap p-4 font-mono text-[13px] leading-relaxed text-ink-200">
              <span className="text-ink-400">To: {CONTACT_EMAIL}{'\n'}Subject: {SUBJECT}{'\n\n'}</span>{TEMPLATE}
            </pre>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Button as="a" href={mailto}><FiMail className="h-4 w-4" /> Open in email app</Button>
            <span className="text-sm text-ink-400">or write to <a href={`mailto:${CONTACT_EMAIL}`} className="text-white underline-offset-2 hover:underline">{CONTACT_EMAIL}</a></span>
          </div>

          <div className="mt-6 border-t border-white/[0.06] pt-5">
            <p className="text-sm font-semibold text-white">What happens next</p>
            <ol className="mt-3 grid gap-3 sm:grid-cols-3">
              {['We confirm receipt within 48 hours', 'Your data is permanently deleted within 30 days', 'You receive a final confirmation email'].map((t, i) => (
                <li key={t} className="flex gap-2.5 text-sm text-ink-300">
                  <span className="font-mono text-xs text-brand-400">0{i + 1}</span>{t}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </LegalSection>
    </LegalLayout>
  );
}
