import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { initials } from '@/components/roster/utils'
import { STATE_SCRIPT_LOGO, BULLDOG_MASCOT_LOGO } from '@/components/roster/sheetLogos'
import PrintTrigger from './PrintTrigger'
import './sheet.css'

function classLabel(board) {
  if (board === 'rec2027') return 'CLASS OF 2027'
  if (board === 'rec2028') return 'CLASS OF 2028'
  if (board === 'transfer') return 'TRANSFER'
  return ''
}

export default async function ProspectSheetPage({ params }) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: staffRow } = await supabase
    .from('staff')
    .select('role')
    .eq('id', user.id)
    .single()
  if (!staffRow) redirect('/')

  const { data: prospect } = await supabase.from('prospects').select('*').eq('id', id).single()
  if (!prospect) notFound()

  return (
    <div className="sheet-page">
      <PrintTrigger />

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
        <div>
          <div className="sheet-block">
            <div className="sheet-block-head">Measurements</div>
            <table className="sheet-table">
              <tbody>
                <tr>
                  <td className="k">Height</td>
                  <td>{prospect.height || ''}</td>
                </tr>
                <tr>
                  <td className="k">Weight</td>
                  <td>{prospect.weight ? `${prospect.weight} lbs` : ''}</td>
                </tr>
                <tr>
                  <td className="k">Wingspan</td>
                  <td>{prospect.wingspan || ''}</td>
                </tr>
                <tr>
                  <td className="k">Standing reach</td>
                  <td>{prospect.standing_reach || ''}</td>
                </tr>
                <tr>
                  <td className="k">Dominant hand</td>
                  <td>{prospect.dominant_hand || ''}</td>
                </tr>
              </tbody>
            </table>
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

          <div className="sheet-block">
            <div className="sheet-block-head">Contact Information</div>
            <table className="sheet-table">
              <tbody>
                <tr>
                  <td className="k">Player cell</td>
                  <td>{prospect.player_cell || ''}</td>
                </tr>
                <tr>
                  <td className="k">X</td>
                  <td>{prospect.twitter_handle || ''}</td>
                </tr>
                <tr>
                  <td className="k">Instagram</td>
                  <td>{prospect.instagram_handle || ''}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div>
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
            <div className="sheet-eval-row" style={{ minHeight: '160px' }}>
              <div className="k">Current game breakdown</div>
              <div className="v">{prospect.game_breakdown || ''}</div>
            </div>
          </div>

          <div className="sheet-block">
            <div className="sheet-block-head">Recruiting Information</div>
            <table className="sheet-table">
              <tbody>
                <tr>
                  <td className="k">High school coach</td>
                  <td>{prospect.hs_coach || ''}</td>
                </tr>
                <tr>
                  <td className="k">AAU coach</td>
                  <td>{prospect.aau_coach || ''}</td>
                </tr>
                <tr>
                  <td className="k">Agent / Representative</td>
                  <td>{prospect.agent || ''}</td>
                </tr>
                <tr>
                  <td className="k">Offers</td>
                  <td>{prospect.offers || ''}</td>
                </tr>
                <tr>
                  <td className="k">OV date</td>
                  <td>{prospect.ov_date || ''}</td>
                </tr>
                <tr>
                  <td className="k">Main competition</td>
                  <td>{prospect.main_competition || ''}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="sheet-block-head">2026 AAU Statline</div>
      <table className="sheet-stat-table">
        <thead>
          <tr>
            <th>PPG</th>
            <th>RPG</th>
            <th>APG</th>
            <th>BPG</th>
            <th>FG %</th>
            <th>FT %</th>
            <th>3PT %</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{prospect.ppg || ''}</td>
            <td>{prospect.rpg || ''}</td>
            <td>{prospect.apg || ''}</td>
            <td>{prospect.bpg || ''}</td>
            <td>{prospect.fg_pct || ''}</td>
            <td>{prospect.ft_pct || ''}</td>
            <td>{prospect.three_pt_pct || ''}</td>
          </tr>
        </tbody>
      </table>

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
