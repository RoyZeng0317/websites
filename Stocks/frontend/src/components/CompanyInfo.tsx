import type { StockInfo } from '../types/stock'
import { Building2, Phone, MapPin, Users, Calendar, FileText, BadgeCheck, Mail, Printer } from 'lucide-react'

interface Props {
  info: StockInfo
}

export default function CompanyInfo({ info }: Props) {
  const hasMgmt = info.chairman || info.generalManager || info.spokesperson
  const hasContact = info.phone || info.companyAddress || info.fax || info.companyEmail || info.website
  const hasCorp = info.establishedDate || info.listingDate || info.capital || info.shareTransferAgency || info.auditorFirm
  if (!hasMgmt && !hasContact && !hasCorp) return null

  return (
    <div>
      <h2 className="text-lg font-semibold text-slate-200 mb-4">公司基本資料</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {hasMgmt && (
          <div className="bg-slate-800/50 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4 text-emerald-400">
              <Users size={18} />
              <h3 className="font-medium text-slate-200">管理團隊</h3>
            </div>
            <div className="space-y-3">
              {info.chairman && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-400">董事長</span>
                  <span className="text-sm font-medium text-slate-200">{info.chairman}</span>
                </div>
              )}
              {info.generalManager && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-400">總經理</span>
                  <span className="text-sm font-medium text-slate-200">{info.generalManager}</span>
                </div>
              )}
              {info.spokesperson && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-400">發言人</span>
                  <span className="text-sm font-medium text-slate-200">
                    {info.spokesperson}{info.spokespersonTitle ? ` (${info.spokespersonTitle})` : ''}
                  </span>
                </div>
              )}
              {info.deputySpokesperson && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-400">代理發言人</span>
                  <span className="text-sm font-medium text-slate-200">{info.deputySpokesperson}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {hasContact && (
          <div className="bg-slate-800/50 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4 text-emerald-400">
              <Building2 size={18} />
              <h3 className="font-medium text-slate-200">聯絡方式</h3>
            </div>
            <div className="space-y-3">
              {info.phone && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-400"><Phone size={14} className="inline mr-1" />電話</span>
                  <span className="text-sm font-medium text-slate-200">{info.phone}</span>
                </div>
              )}
              {info.fax && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-400"><Printer size={14} className="inline mr-1" />傳真</span>
                  <span className="text-sm font-medium text-slate-200">{info.fax}</span>
                </div>
              )}
              {info.companyEmail && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-400"><Mail size={14} className="inline mr-1" />Email</span>
                  <span className="text-sm font-medium text-slate-200 truncate max-w-[200px]">{info.companyEmail}</span>
                </div>
              )}
              {info.website && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-400">網站</span>
                  <span className="text-sm font-medium text-slate-200 truncate max-w-[200px]">{info.website}</span>
                </div>
              )}
              {info.companyAddress && (
                <div className="flex justify-between items-start">
                  <span className="text-sm text-slate-400"><MapPin size={14} className="inline mr-1" />地址</span>
                  <span className="text-sm font-medium text-slate-200 text-right max-w-[220px]">{info.companyAddress}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {hasCorp && (
          <div className="bg-slate-800/50 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4 text-emerald-400">
              <FileText size={18} />
              <h3 className="font-medium text-slate-200">公司概況</h3>
            </div>
            <div className="space-y-3">
              {info.establishedDate && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-400"><Calendar size={14} className="inline mr-1" />成立日期</span>
                  <span className="text-sm font-medium text-slate-200">{info.establishedDate}</span>
                </div>
              )}
              {info.listingDate && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-400">上市日期</span>
                  <span className="text-sm font-medium text-slate-200">{info.listingDate}</span>
                </div>
              )}
              {info.capital != null && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-400">實收資本額</span>
                  <span className="text-sm font-medium text-slate-200">
                    {(info.capital / 1e8).toFixed(2)} 億
                  </span>
                </div>
              )}
              {info.employees != null && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-400">員工人數</span>
                  <span className="text-sm font-medium text-slate-200">{info.employees.toLocaleString()}</span>
                </div>
              )}
              {info.shareTransferAgency && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-400">股務機構</span>
                  <span className="text-sm font-medium text-slate-200 truncate max-w-[200px]">{info.shareTransferAgency}</span>
                </div>
              )}
              {info.auditorFirm && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-400"><BadgeCheck size={14} className="inline mr-1" />會計師</span>
                  <span className="text-sm font-medium text-slate-200 truncate max-w-[200px]">{info.auditorFirm}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
