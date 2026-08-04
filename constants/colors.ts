/**
 * Central color palette for the app.
 * Screens/components should reference these tokens instead of raw hex values
 * so the theme can be adjusted in one place.
 * (Taxonomy/chart category colors live in features/cars/constants/colors.ts.)
 */
export const ColorsUnused = {
  // Backgrounds & surfaces
  background: '#1C1643',        // main app background
  surface: '#2C1F5E',           // cards, modals, inputs
  surfaceSelected: '#3D2F8A',   // selected/highlighted card
  border: '#3D2F6E',            // borders, dividers, secondary buttons
  overlay: 'rgba(0,0,0,0.6)',   // modal backdrop

  // Brand
  primary: '#7142CD',           // main purple accent
  primaryLight: '#9B7BE0',      // lighter purple for links/secondary actions

  // Text
  white: '#fff',
  textPrimary: '#E1E1E2',       // main text
  textSecondary: '#B0B0B2',     // secondary text
  textMuted: '#8A8A8C',         // placeholders, hints
  textSoft: '#C4BDE0',          // soft lavender body text (modals)
  purpleMuted: '#7A6EA0',       // muted purple subtitles (make/model)
  purpleSoft: '#9B8FBF',        // soft purple labels (status rows)
  textFaint: '#665e7f80',       // faint text (empty states)

  // Status
  success: '#4CAF50',
  warning: '#FFA500',
  warningSoft: '#F0C040',       // 15-30 days left
  warningStrong: '#FF8C00',     // <=14 days left
  danger: '#FF4444',
  dangerFaint: '#FF444422',     // danger tint backgrounds (sold tag)

  // License plate
  plateBackground: '#F5F0D0',
  plateBorder: '#C8B800',
  plateText: '#1A1A1A',
} as const;

/**
 * Discord dark mode theme — same tokens as `Colors`, using the palette of the
 * Discord app's dark theme. To try it, swap it in for `Colors` above
 * (e.g. `export const Colors = DiscordDarkColors;`).
 */
export const Colors = {
  // Backgrounds & surfaces
  background: '#1E1F22',        // main chat background
  surface: '#2B2D31',           // sidebar / darker panels
  surfaceSelected: '#404249',   // selected/hover state
  border: '#3F4147',            // dividers
  overlay: 'rgba(12, 10, 10, 0.6)',   // modal backdrop

  // Brand
  primary: '#5865F2',           // blurple
  primaryLight: '#7983F5',      // lighter blurple tint

  // Text
  white: '#fff',
  textPrimary: '#DBDEE1',       // main text
  textSecondary: '#B5BAC1',     // secondary text
  textMuted: '#949BA4',         // placeholders, hints
  textSoft: '#C4C9CE',          // soft body text (modals)
  purpleMuted: '#80848E',       // muted subtitles (interactive-muted gray)
  purpleSoft: '#949BA4',        // soft labels (status rows)
  textFaint: '#6d6f7880',       // faint text (empty states)

  // Status
  success: '#0fbf47',           // Discord green
  warning: '#ffb31b',           // in-app yellow
  warningSoft: '#FEE75C',       // brand yellow — 15-30 days left
  warningStrong: '#FF8C00',     // orange (no Discord equivalent) — <=14 days left
  danger: '#ED4245',            // Discord red
  dangerFaint: '#ED424522',     // danger tint backgrounds (sold tag)

  // License plate — kept identical; a plate looks the same in any theme
  plateBackground: '#F5F0D0',
  plateBorder: '#C8B800',
  plateText: '#1A1A1A',
} as const 
