'use client'

import { useState, useEffect } from 'react'
import { Pencil, Trash2, Plus, ChevronRight, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/lib/i18n'
import { levelColor } from '@/utils/fortune-helpers'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useProfileStore, RELATION_TYPES } from '@/stores/profile'
import { usePartnerCompatibilities } from '@/hooks/use-compatibility'
import type { PartnerCompatibility, PartnerRelationType } from '@/types/compatibility'
import type { Partner } from '@/stores/profile'

// ---- PartnerFormDialog ----

interface PartnerFormDialogProps {
  open: boolean
  editPartner?: Partner | null
  onClose: () => void
  onSaved: () => void
}

function PartnerFormDialog({ open, editPartner, onClose, onSaved }: PartnerFormDialogProps) {
  const { addPartner, updatePartner } = useProfileStore()
  const { t } = useTranslation()
  const [nickname, setNickname] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [relation, setRelation] = useState<string>('friend')

  useEffect(() => {
    if (open) {
      if (editPartner) {
        setNickname(editPartner.nickname)
        setBirthDate(editPartner.birthDate)
        setRelation(editPartner.relation || 'friend')
      } else {
        setNickname('')
        setBirthDate('')
        setRelation('friend')
      }
    }
  }, [open, editPartner])

  if (!open) return null

  function handleSave() {
    if (!nickname || !birthDate) return
    if (editPartner) {
      updatePartner(editPartner.id, { nickname, birthDate, relation: relation as PartnerRelationType })
    } else {
      addPartner({ nickname, birthDate, relation: relation as PartnerRelationType })
    }
    onSaved()
    onClose()
  }

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm'>
      <div className='bg-background border border-border rounded-xl shadow-xl w-full max-w-sm mx-4 p-6 flex flex-col gap-4'>
        <h3 className='text-base font-semibold text-foreground'>
          {editPartner ? t('v3.match.editPartner') : t('v3.match.addPartner')}
        </h3>

        <div className='flex flex-col gap-1'>
          <label className='text-xs text-muted-foreground'>{t('profile.nickname')}</label>
          <input
            type='text'
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder={t('profile.nicknamePlaceholder')}
            maxLength={50}
            className='h-9 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary'
          />
        </div>

        <div className='flex flex-col gap-1'>
          <label className='text-xs text-muted-foreground'>{t('profile.birthDate')}</label>
          <input
            type='date'
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            min='1900-01-01'
            max={new Date().toISOString().slice(0, 10)}
            className='h-9 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary'
          />
        </div>

        <div className='flex flex-col gap-1'>
          <label className='text-xs text-muted-foreground'>{t('profile.relation')}</label>
          <div className='flex flex-wrap gap-1.5'>
            {RELATION_TYPES.map((rt) => (
              <button
                key={rt.value}
                type='button'
                onClick={() => setRelation(rt.value)}
                title={t(rt.descKey)}
                className={cn(
                  'px-3 py-1.5 rounded-full text-xs border transition-colors',
                  relation === rt.value
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'border-border text-muted-foreground hover:border-primary hover:text-primary'
                )}
              >
                {t(rt.labelKey)}
              </button>
            ))}
          </div>
        </div>

        <div className='flex gap-2 justify-end mt-2'>
          <Button variant='outline' size='sm' onClick={onClose}>{t('common.cancel')}</Button>
          <Button size='sm' disabled={!nickname || !birthDate} onClick={handleSave}>{t('common.save')}</Button>
        </div>
      </div>
    </div>
  )
}

// ---- PartnerCard ----

interface PartnerCardProps {
  partner: Partner
  compat?: PartnerCompatibility
  onSelect: (id: string) => void
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

function PartnerCard({ partner, compat, onSelect, onEdit, onDelete }: PartnerCardProps) {
  const { t } = useTranslation()
  const ds = compat?.directional_scores
  const verdict = compat?.verdict

  return (
    <div
      className='bg-card border border-border rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer'
      role='button'
      tabIndex={0}
      onClick={() => onSelect(partner.id)}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelect(partner.id)}
    >
      {/* top row */}
      <div className='flex items-center gap-3 px-4 py-3'>
        <div className='flex-1 min-w-0'>
          <p className='text-sm font-medium text-foreground truncate'>{partner.nickname}</p>
          <div className='flex items-center gap-2 mt-0.5'>
            {partner.relation && (
              <span className='text-xs text-muted-foreground'>
                {t(RELATION_TYPES.find((r) => r.value === partner.relation)?.labelKey ?? partner.relation)}
              </span>
            )}
            <span className='text-xs text-muted-foreground tabular-nums'>{partner.birthDate}</span>
          </div>
        </div>

        {/* mansion */}
        {compat && (
          <div className='flex flex-col items-end gap-0.5 shrink-0'>
            <span className='text-xs text-muted-foreground'>{compat.mansion.name_jp}</span>
            <span className='text-[10px] text-muted-foreground'>{compat.mansion.yosei}</span>
          </div>
        )}

        {/* scores */}
        {ds ? (
          <div className='flex flex-col gap-0.5 items-end shrink-0 min-w-[80px]'>
            <div className='flex items-center gap-1 text-xs'>
              <span className='text-muted-foreground'>{t('common.me')}</span>
              <span className='font-medium text-foreground'>
                {ds.person1_to_person2.position}
              </span>
              <span className='text-[10px] text-muted-foreground'>{ds.person1_to_person2.direction}</span>
            </div>
            <div className='flex items-center gap-1 text-xs'>
              <span className='text-muted-foreground'>{t('common.other')}</span>
              <span className='font-medium text-foreground'>
                {ds.person2_to_person1.position}
              </span>
              <span className='text-[10px] text-muted-foreground'>{ds.person2_to_person1.direction}</span>
            </div>
          </div>
        ) : compat ? (
          <span className={cn('text-base font-bold shrink-0', levelColor(compat.level))}>
            {compat.level_name}
          </span>
        ) : null}

        <div className='flex items-center gap-1 shrink-0' onClick={(e) => e.stopPropagation()}>
          <button
            type='button'
            onClick={() => onEdit(partner.id)}
            className='p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors'
            aria-label={t('common.edit')}
          >
            <Pencil className='h-3.5 w-3.5' aria-hidden='true' />
          </button>
          <button
            type='button'
            onClick={() => onDelete(partner.id)}
            className='p-1.5 rounded text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors'
            aria-label={t('common.delete')}
          >
            <Trash2 className='h-3.5 w-3.5' aria-hidden='true' />
          </button>
          <ChevronRight className='h-4 w-4 text-muted-foreground' aria-hidden='true' />
        </div>
      </div>

      {/* initiative summary */}
      {compat?.relation?.initiative && (
        <div className='px-4 pb-2 flex items-center gap-2 border-t border-border/50 pt-2' onClick={(e) => e.stopPropagation()}>
          <span className='text-xs font-medium text-primary shrink-0'>{compat.relation.initiative.initiative}</span>
          <span className='text-xs text-muted-foreground truncate'>{compat.relation.initiative.headline}</span>
        </div>
      )}

      {/* verdict warning */}
      {verdict && (verdict.severity === 'caution' || verdict.severity === 'warning') && (
        <div className='px-4 pb-2 flex items-start gap-2 text-xs text-amber-600 dark:text-amber-400' onClick={(e) => e.stopPropagation()}>
          <AlertTriangle className='h-3.5 w-3.5 shrink-0 mt-0.5' aria-hidden='true' />
          <span className='truncate'>{verdict.verdict}</span>
        </div>
      )}
    </div>
  )
}

// ---- PartnerList ----

interface PartnerListProps {
  onSelectPartner: (id: string) => void
}

export function PartnerList({ onSelectPartner }: PartnerListProps) {
  const { t } = useTranslation()
  const { partners, deletePartner } = useProfileStore()
  const { partnerCompatibilities, loading, fetchAll } = usePartnerCompatibilities()

  const [formOpen, setFormOpen] = useState(false)
  const [editPartner, setEditPartner] = useState<Partner | null>(null)

  useEffect(() => {
    fetchAll()
  }, [fetchAll])

  function handleEdit(id: string) {
    const p = partners.find((p) => p.id === id)
    if (p) { setEditPartner(p); setFormOpen(true) }
  }

  function handleDelete(id: string) {
    const p = partners.find((p) => p.id === id)
    if (confirm(t('profile.confirmDeletePartner', { name: p?.nickname ?? '' }))) {
      deletePartner(id)
      fetchAll()
    }
  }

  function handleSaved() {
    fetchAll()
  }

  const compatMap = new Map(partnerCompatibilities.map((pc) => [pc.partnerId, pc]))

  return (
    <div className='flex flex-col gap-3'>
      <div className='flex items-center justify-between'>
        <h3 className='text-sm font-medium text-foreground'>
          {t('profile.savedPartners')}
          <span className='ml-1.5 text-xs text-muted-foreground tabular-nums'>{partners.length}/20</span>
        </h3>
        <Button
          size='sm'
          variant='outline'
          disabled={partners.length >= 20}
          onClick={() => { setEditPartner(null); setFormOpen(true) }}
          className='flex items-center gap-1'
        >
          <Plus className='h-3.5 w-3.5' aria-hidden='true' />
          {t('common.add')}
        </Button>
      </div>

      {loading && (
        <div className='flex flex-col gap-2'>
          {[1, 2, 3].map((i) => <Skeleton key={i} className='h-16 rounded-lg' />)}
        </div>
      )}

      {!loading && !partners.length && (
        <Card>
          <CardContent className='pt-8 pb-8 flex flex-col items-center gap-3 text-center'>
            <p className='text-sm text-muted-foreground'>{t('v3.match.noSavedPartners')}</p>
            <p className='text-xs text-muted-foreground max-w-xs'>{t('v3.match.pairLuckyDesc')}</p>
            <Button
              size='sm'
              onClick={() => { setEditPartner(null); setFormOpen(true) }}
              className='flex items-center gap-1'
            >
              <Plus className='h-3.5 w-3.5' aria-hidden='true' />
              {t('v3.match.addPartner')}
            </Button>
          </CardContent>
        </Card>
      )}

      {!loading && partners.length > 0 && (
        <div className='flex flex-col gap-2'>
          {partners.map((partner) => (
            <PartnerCard
              key={partner.id}
              partner={partner}
              compat={compatMap.get(partner.id)}
              onSelect={onSelectPartner}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* partner matrix (when >= 2) */}
      {!loading && partnerCompatibilities.length >= 2 && (
        <PartnerMatrix partnerCompatibilities={partnerCompatibilities} onSelect={onSelectPartner} />
      )}

      <PartnerFormDialog
        open={formOpen}
        editPartner={editPartner}
        onClose={() => setFormOpen(false)}
        onSaved={handleSaved}
      />
    </div>
  )
}

// ---- PartnerMatrix ----

const RELATION_ORDER = ['eishin', 'gyotai', 'mei', 'yusui', 'kisei', 'ankai'] as const

function relationColor(type: string) {
  if (type === 'mei') return 'bg-[var(--fortune-caution)]/10 text-[var(--fortune-caution)]'
  if (type === 'gyotai') return 'bg-[var(--fortune-caution)]/10 text-[var(--fortune-caution)]'
  if (type === 'eishin') return 'bg-[var(--fortune-great)]/10 text-[var(--fortune-great)]'
  if (type === 'yusui') return 'bg-[var(--fortune-good)]/10 text-[var(--fortune-good)]'
  if (type === 'kisei') return 'bg-[var(--fortune-caution)]/10 text-[var(--fortune-caution)]'
  if (type === 'ankai') return 'bg-[var(--fortune-bad)]/10 text-[var(--fortune-bad)]'
  return 'bg-muted/40 text-muted-foreground'
}

function PartnerMatrix({
  partnerCompatibilities,
  onSelect,
}: {
  partnerCompatibilities: PartnerCompatibility[]
  onSelect: (id: string) => void
}) {
  const { t } = useTranslation()
  const grouped = RELATION_ORDER
    .map((type) => ({
      type,
      items: partnerCompatibilities.filter((pc) => pc.relation.type === type),
    }))
    .filter((g) => g.items.length > 0)

  const positive = partnerCompatibilities.filter((pc) => pc.level === 'daikichi' || pc.level === 'kichi').length
  const harmony = Math.round((positive / partnerCompatibilities.length) * 100)

  return (
    <div className='flex flex-col gap-3 mt-2'>
      <div className='flex items-center gap-3'>
        <h4 className='text-sm font-medium text-foreground'>{t('v3.match.matrixMode')}</h4>
        <span className='text-xs text-muted-foreground'>
          {t('v3.match.harmonyRate')} <span className={cn('font-bold', harmony >= 50 ? 'text-[var(--fortune-great)]' : 'text-[var(--fortune-caution)]')}>{harmony}%</span>
        </span>
      </div>
      {grouped.map((group) => (
        <div key={group.type} className='flex flex-col gap-1.5'>
          <p className='text-xs font-medium text-muted-foreground'>
            {group.items[0].relation.name}（{group.items[0].relation.reading}）
          </p>
          <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2'>
            {group.items.map((pc) => (
              <button
                key={pc.partnerId}
                type='button'
                onClick={() => onSelect(pc.partnerId)}
                className={cn(
                  'flex flex-col items-center gap-0.5 px-2 py-2 rounded-lg text-xs transition-shadow hover:shadow-md',
                  relationColor(group.type)
                )}
              >
                <span className='font-medium truncate max-w-full'>{pc.nickname}</span>
                <span className='text-sm font-bold'>{pc.level_name}</span>
                <span className='text-[10px] opacity-70'>{pc.mansion.name_jp}</span>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
