/**
 * Central color palette for the app.
 * Screens/components should reference these tokens instead of raw hex values
 * so the theme can be adjusted in one place.
 * (Taxonomy/chart category colors live in features/cars/constants/colors.ts.)
 */
export const Colors = {
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
