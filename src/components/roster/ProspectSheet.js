'use client'

import { initials } from './utils'
import { STATE_SCRIPT_LOGO, BULLDOG_MASCOT_LOGO } from './sheetLogos'
import './sheet.css'

function classLabel(board) {
  if (board === 'rec2027') return 'CLASS OF 2027'
  if (board === 'rec2028') return 'CLASS OF 2028'
  if (board === 'transfer') return 'TRANSFER'
  return ''
}

function KvRow({ label, value }) {
  return (
    <div className="sheet-kv-row">
      <span className="k">{label}</span>
      <span className="v">{value || ''}</span>
    </div>
  )
}

export default function ProspectSheet({ prospect }) {
  return (
    <div className="sheet-page prospect-sheet-print">
      <div className="sheet-header">
        <div className="sheet-photo">
          {prospect.photo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={prospect.photo_url} alt={prospect.name} />
          ) : (
            <span className="initials">{initials(prospect.name)}</span>
          )}
        </div>
        <div style={{ flex: 1 }}>
          <div className="sheet-name">{prospect.name}</div>
          <div className="sheet-line">
            {prospect.height && <span>{prospect.height}</span>}
            {prospect.weight && (
              <>
                <span className="sep">|</span>
                <span>{prospect.weight} lbs</span>
              </>
            )}
            {prospect.position_group && (
              <>
                <span className="sep">|</span>
                <span>{prospect.position_group.toUpperCase()}</span>
              </>
            )}
            {classLabel(prospect.board) && (
              <>
                <span className="sep">|</span>
                <span>{classLabel(prospect.board)}</span>
              </>
            )}
          </div>
          <div className="sheet-line sub">
            {prospect.high_school && <span>{prospect.high_school}</span>}
            {prospect.aau_team && (
              <>
                <span className="sep">|</span>
                <span>{prospect.aau_team}</span>
              </>
            )}
            {prospect.hometown && (
              <>
                <span className="sep">|</span>
                <span>{prospect.hometown}</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="sheet-body">
        <div className="sheet-col">
          <div className="sheet-block">
            <div className="sheet-block-head">Measurements</div>
            <div className="sheet-kv-box">
              <KvRow label="Height" value={prospect.height} />
              <KvRow label="Weight" value={prospect.weight ? `${prospect.weight} lbs` : ''} />
              <KvRow label="Wingspan" value={prospect.wingspan} />
              <KvRow label="Standing reach" value={prospect.standing_reach} />
              <KvRow label="Dominant hand" value={prospect.dominant_hand} />
            </div>
          </div>

          <div className="sheet-block">
            <div className="sheet-block-head">Shot Chart</div>
            <div className="sheet-shot-chart">
              {prospect.shot_chart_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={prospect.shot_chart_url} alt="Shot chart" />
              ) : (
                <span className="empty">No shot chart uploaded</span>
              )}
            </div>
          </div>

          <div className="sheet-block sheet-block-grow">
            <div className="sheet-block-head">Contact Information</div>
            <div className="sheet-kv-box">
              <KvRow label="Player cell" value={prospect.player_cell} />
              <KvRow label="X" value={prospect.twitter_handle} />
              <KvRow label="Instagram" value={prospect.instagram_handle} />
            </div>
          </div>
        </div>

        <div className="sheet-col">
          <div className="sheet-block">
            <div className="sheet-block-head">Evaluation</div>
            <div className="sheet-eval-row">
              <div className="k">Main recruiter</div>
              <div className="v">{prospect.main_recruiter || ''}</div>
            </div>
            <div className="sheet-eval-row">
              <div className="k">SEC comp</div>
              <div className="v">{prospect.sec_comp || ''}</div>
            </div>
            <div className="sheet-eval-row" style={{ minHeight: '140px' }}>
              <div className="k">Current game breakdown</div>
              <div className="v">{prospect.game_breakdown || ''}</div>
            </div>
          </div>

          <div className="sheet-block sheet-block-grow">
            <div className="sheet-block-head">Recruiting Information</div>
            <div className="sheet-kv-box">
              <KvRow label="High school coach" value={prospect.hs_coach} />
              <KvRow label="AAU coach" value={prospect.aau_coach} />
              <KvRow label="Agent / Representative" value={prospect.agent} />
              <KvRow label="Offers" value={prospect.offers} />
              <KvRow label="OV date" value={prospect.ov_date} />
              <KvRow label="Main competition" value={prospect.main_competition} />
            </div>
          </div>
        </div>
      </div>

      <div className="sheet-block" style={{ marginTop: '10px' }}>
        <div className="sheet-block-head">2026 AAU Statline</div>
        <div className="sheet-stat-row">
          {[
            ['PPG', prospect.ppg],
            ['RPG', prospect.rpg],
            ['APG', prospect.apg],
            ['BPG', prospect.bpg],
            ['FG %', prospect.fg_pct],
            ['FT %', prospect.ft_pct],
            ['3PT %', prospect.three_pt_pct],
          ].map(([label, value]) => (
            <div className="sheet-stat-cell" key={label}>
              <div className="stat-label">{label}</div>
              <div className="stat-value">{value || ''}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="sheet-footer">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="state-logo" src={STATE_SCRIPT_LOGO} alt="State" />
        <div className="fline" />
        <span className="fname">Mississippi State Men&apos;s Basketball</span>
        <div className="fline" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="bulldog-logo" src={BULLDOG_MASCOT_LOGO} alt="Bully" />
      </div>
    </div>
  )
}
