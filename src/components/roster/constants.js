import { DRAFTEXPRESS_LOGO } from './draftExpressLogo'
import { MAROON_WHITE_DAILY_LOGO } from './maroonWhiteLogo'
import { GENES_PAGE_LOGO } from './genesPageLogo'
import { TBS_LOGO } from './tbsLogo'

export const POSITIONS = ['PG', 'SG', 'SF', 'PF', 'C']

export const CLASS_OPTIONS = [
  'Fr',
  'RS-Fr',
  'So',
  'RS-So',
  'Jr',
  'RS-Jr',
  'Sr',
  'RS-Sr',
  'Grad',
]

export const DEFAULT_SETTINGS = {
  teamName: 'Mississippi State Basketball',
  rosterLimit: 15,
}

export const QUICK_LINKS = [
  {
    label: 'Recruiting Rankings (Team)',
    url: 'https://www.on3.com/rivals/rankings/industry-team/basketball/2026/',
  },
  {
    label: 'ON3 HS Rankings',
    url: 'https://www.on3.com/rivals/rankings/industry-player/basketball/2027/',
  },
  {
    label: '247 HS Rankings',
    url: 'https://247sports.com/season/2027-basketball/RecruitRankings/?InstitutionGroup=HIGHSCHOOL',
  },
  {
    label: 'ESPN HS Rankings',
    url: 'https://www.espn.com/college-sports/basketball/recruiting/rankings/scnext300boys',
  },
  { label: 'KenPom', url: 'https://kenpom.com' },
]

export const RECRUITING_SERVICES = [
  {
    name: 'DraftExpress',
    sub: 'Scouting & Draft Analysis',
    url: 'https://www.draftexpress.com/gold/index.php',
    logo: DRAFTEXPRESS_LOGO,
  },
  {
    name: 'Maroon and White Daily',
    sub: 'On3 Team Site',
    url: 'https://www.on3.com/teams/mississippi-state-bulldogs/',
    logo: MAROON_WHITE_DAILY_LOGO,
  },
  {
    name: "Gene's Page",
    sub: '247Sports Team Site',
    url: 'https://247sports.com/college/mississippi-state/',
    logo: GENES_PAGE_LOGO,
  },
  {
    name: 'Travis Branham Scouting',
    sub: 'Scouting Service',
    url: 'https://portal.tbscouting.com/dashboard',
    logo: TBS_LOGO,
  },
]

export const RECRUITING_POSITION_GROUPS = [
  'Point Guard',
  'Combo Guard',
  'Shooting Guard',
  'Wing',
  'Forward',
  'Center',
]

export const PAGE_LABELS = {
  rec2027: '2027 Recruiting',
  rec2028: '2028 Recruiting',
  transfer: 'Transfer Recruiting',
  rosterBuilder: 'Roster Builder',
  contacts: 'Contacts',
}

export const RECRUITING_BOARDS = {
  rec2027: '2027 Recruiting Board',
  rec2028: '2028 Recruiting Board',
  transfer: 'Transfer Recruiting Board',
}
