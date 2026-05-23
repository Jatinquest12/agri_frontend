"use client";

import { useRef } from "react";

import type { Farm } from "@/types/platform";

export function FarmCertificate({
  farm,
}: {
  farm: Farm;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const print = () => {
    const node = ref.current;
    if (!node) return;
    const w = window.open("", "_blank", "width=820,height=1100");
    if (!w) return;
    w.document.write(
      `<!doctype html><html><head><title>Certificate</title><style>
        body{font-family:Georgia,serif;padding:32px;color:#0f172a}
        h1{font-size:22px;margin:0 0 8px}
        .meta{font-size:13px;color:#475569;margin-bottom:24px}
        .box{border:2px solid #059669;padding:20px;border-radius:12px}
        .row{display:flex;justify-content:space-between;margin:8px 0;font-size:14px}
        </style></head><body>`,
    );
    w.document.write(node.innerHTML);
    w.document.write("</body></html>");
    w.document.close();
    w.focus();
    w.print();
    w.close();
  };

  return (
    <div>
      <div ref={ref} className="box rounded-xl border-2 border-emerald-600 bg-white p-6 text-slate-900">
        <h1 className="text-xl font-bold text-emerald-900">Farm Integrity Certificate</h1>
        <p className="meta">Issued for agronomic proof and traceability.</p>
        <div className="space-y-2 text-sm">
          <div className="row flex justify-between border-b border-slate-200 py-1">
            <span>Farm</span>
            <strong>{farm.name}</strong>
          </div>
          <div className="row flex justify-between border-b border-slate-200 py-1">
            <span>Crop</span>
            <strong>{farm.cropType}</strong>
          </div>
          <div className="row flex justify-between border-b border-slate-200 py-1">
            <span>Area (acres)</span>
            <strong>{farm.areaAcres}</strong>
          </div>
          <div className="row flex justify-between border-b border-slate-200 py-1">
            <span>Health score</span>
            <strong>{farm.healthScore ?? "Run AI pipeline"}</strong>
          </div>
          <div className="row flex justify-between border-b border-slate-200 py-1">
            <span>Proof hash</span>
            <strong className="max-w-[55%] truncate font-mono text-xs">
              {farm.proofHash ?? "Pending"}
            </strong>
          </div>
          <div className="row flex justify-between py-1">
            <span>On-chain reference</span>
            <strong className="max-w-[55%] truncate font-mono text-xs">
              {farm.txId ?? "Pending"}
            </strong>
          </div>
        </div>
      </div>
      <button
        type="button"
        onClick={print}
        className="mt-3 rounded-lg bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-800"
      >
        Download / print PDF
      </button>
      <p className="mt-2 text-xs text-slate-500">
        Opens a print dialog — choose “Save as PDF” where supported.
      </p>
    </div>
  );
}
