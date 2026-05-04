import { getReadableTextColor } from '../../invitations/theme/contrast';

const createTheme = (base) => ({
  ...base,
  tokens: {
    ...base.tokens,
    heroText: base.tokens.heroText || getReadableTextColor(base.tokens.heroBg || base.tokens.pageBg || '#FFFFFF'),
    quoteText: base.tokens.quoteText || getReadableTextColor(base.tokens.quoteBg || base.tokens.sectionAltBg || '#FFFFFF'),
    rsvpText: base.tokens.rsvpText || getReadableTextColor(base.tokens.rsvpBg || '#FFFFFF'),
    footerText: base.tokens.footerText || getReadableTextColor(base.tokens.footerBg || '#1A1A1A'),
    heroButtonBorder: base.tokens.heroButtonBorder || (getReadableTextColor(base.tokens.heroBg || '#FFFFFF') === '#FFFFFF' ? '#FFFFFF' : '#2F2E2E'),
    heroButtonText: base.tokens.heroButtonText || (getReadableTextColor(base.tokens.heroBg || '#FFFFFF') === '#FFFFFF' ? '#FFFFFF' : '#2F2E2E'),
    heroButtonHoverBg: base.tokens.heroButtonHoverBg || (getReadableTextColor(base.tokens.heroBg || '#FFFFFF') === '#FFFFFF' ? '#FFFFFF' : '#2F2E2E'),
    heroButtonHoverText: base.tokens.heroButtonHoverText || (getReadableTextColor(base.tokens.heroBg || '#FFFFFF') === '#FFFFFF' ? '#1A1A1A' : '#FFFFFF'),
  },

  primaryColor: base.tokens.accent,
  secondaryColor: base.tokens.sectionAltBg,
  titleColor: base.tokens.titleText,
  bodyTextColor: base.tokens.bodyText,
  mutedTextColor: base.tokens.mutedText,
  surfaceColor: base.tokens.surfaceBg,
  surfaceTextColor: base.tokens.surfaceText,
  borderColor: base.tokens.border,
  heroBackground: base.tokens.heroBg,
  heroOverlay: base.tokens.heroOverlay,
  heroTextColor: base.tokens.heroText,
  heroAccentColor: base.tokens.accentContrast,
  quoteBackground: base.tokens.quoteBackground || base.tokens.heroBg,
  quoteOverlay: base.tokens.quoteOverlay || base.tokens.heroOverlay,
  quoteTextColor: base.tokens.quoteText || base.tokens.heroText,
});

export const themePresets = [
  createTheme({ id:'modernRustic', name:'Rústico elegante moderno', description:'Minimalismo cálido, editorial y fotográfico', palette:['#F7F7F5','#E8E3DB','#2F2E2E','#8A7A68','#A67C52'], tokens:{ pageBg:'#F7F7F5', sectionBg:'#F7F7F5', sectionAltBg:'#E8E3DB', heroBg:'#F7F7F5', heroOverlay:'rgba(255,255,255,0)', heroText:'#2F2E2E', titleText:'#2F2E2E', bodyText:'#57534E', mutedText:'#8A7A68', accent:'#A67C52', accentContrast:'#FFFFFF', surfaceBg:'#FFFFFF', surfaceText:'#2F2E2E', border:'#D8D0C4', buttonBg:'#2F2E2E', buttonText:'#FFFFFF', buttonHoverBg:'#A67C52', buttonHoverText:'#FFFFFF', heroButtonBorder:'#2F2E2E', heroButtonText:'#2F2E2E', heroButtonHoverBg:'#2F2E2E', heroButtonHoverText:'#FFFFFF', quoteBg:'#E8E3DB', quoteText:'#2F2E2E', quoteOverlay:'rgba(255,255,255,0)', countdownBg:'#E8E3DB', countdownNumber:'#2F2E2E', countdownLabel:'#8A7A68', detailsBg:'#F7F7F5', detailsText:'#57534E', galleryBg:'#E8E3DB', galleryText:'#2F2E2E', mapBg:'#F7F7F5', mapText:'#57534E', faqBg:'#F7F7F5', faqText:'#57534E', rsvpBg:'#E8E3DB', rsvpText:'#2F2E2E', footerBg:'#2F2E2E', footerText:'#FFFFFF' } }),
  createTheme({ id:'editorialClassic', name:'Editorial clásico', description:'Crema, blanco y carbón editorial', palette:['#F4F1EA','#FFFFFF','#E6E2D8','#303030'], tokens:{ pageBg:'#F4F1EA', sectionBg:'#FFFFFF', sectionAltBg:'#F4F1EA', heroBg:'linear-gradient(135deg, #4D4A43 0%, #303030 100%)', heroOverlay:'rgba(0,0,0,0.30)', heroText:'#FFFFFF', titleText:'#303030', bodyText:'#575757', mutedText:'#757575', accent:'#303030', accentContrast:'#FFFFFF', surfaceBg:'#FFFFFF', surfaceText:'#303030', border:'#E6E2D8', buttonBg:'#303030', buttonText:'#FFFFFF', buttonHoverBg:'#1A1A1A', buttonHoverText:'#FFFFFF', rsvpBg:'#EFEBE9', rsvpText:'#2F2E2E', footerBg:'#1A1A1A', footerText:'#FFFFFF', quoteBackground:'linear-gradient(135deg, #4D4A43 0%, #303030 100%)', quoteOverlay:'rgba(0,0,0,0.25)', quoteText:'#FFFFFF' } }),
  createTheme({ id:'blancoClasico', name:'Blanco Clásico', description:'Limpio y tradicional', palette:['#FFFFFF','#F8FAFC','#111827','#E5E7EB'], tokens:{ pageBg:'#F8FAFC', sectionBg:'#FFFFFF', sectionAltBg:'#F8FAFC', heroBg:'linear-gradient(135deg,#F8FAFC 0%,#E5E7EB 100%)', heroOverlay:'rgba(255,255,255,0.08)', heroText:'#111827', titleText:'#111827', bodyText:'#374151', mutedText:'#6B7280', accent:'#374151', accentContrast:'#FFFFFF', surfaceBg:'#FFFFFF', surfaceText:'#111827', border:'#E5E7EB', buttonBg:'#111827', buttonText:'#FFFFFF', buttonHoverBg:'#374151', buttonHoverText:'#FFFFFF', rsvpBg:'#FFFFFF', rsvpText:'#111827', footerBg:'#111827', footerText:'#FFFFFF' } }),
  createTheme({ id:'rosaSuave', name:'Rosa Suave', description:'Blush romántico', palette:['#FFF1F4','#F8DDE6','#C7355C','#7A2E45'], tokens:{ pageBg:'#FFF7FA', sectionBg:'#FFFFFF', sectionAltBg:'#FFF1F4', heroBg:'linear-gradient(135deg,#F8DDE6 0%,#FFF7FA 100%)', heroOverlay:'rgba(255,255,255,0.10)', heroText:'#7A2E45', titleText:'#7A2E45', bodyText:'#4B2F38', mutedText:'#8A6470', accent:'#C7355C', accentContrast:'#FFFFFF', surfaceBg:'#FFFFFF', surfaceText:'#4B2F38', border:'#F3C8D5', buttonBg:'#C7355C', buttonText:'#FFFFFF', buttonHoverBg:'#7A2E45', buttonHoverText:'#FFFFFF', rsvpBg:'#FFF1F4', rsvpText:'#4B2F38', footerBg:'#7A2E45', footerText:'#FFFFFF' } }),
  createTheme({ id:'rosaViejo', name:'Rosa Viejo', description:'Dusty rose elegante', palette:['#B76E79','#F8E8EA','#3F2A2E','#FFFFFF'], tokens:{ pageBg:'#FFF7F8', sectionBg:'#FFFFFF', sectionAltBg:'#F8E8EA', heroBg:'linear-gradient(135deg,#E7C6CB 0%,#F8E8EA 100%)', heroOverlay:'rgba(255,255,255,0.10)', heroText:'#3F2A2E', titleText:'#3F2A2E', bodyText:'#5F4B50', mutedText:'#6f5b60', accent:'#B76E79', accentContrast:'#FFFFFF', surfaceBg:'#FFFFFF', surfaceText:'#3F2A2E', border:'#E7C6CB', buttonBg:'#B76E79', buttonText:'#FFFFFF', buttonHoverBg:'#3F2A2E', buttonHoverText:'#FFFFFF', rsvpBg:'#F8E8EA', rsvpText:'#3F2A2E', footerBg:'#3F2A2E', footerText:'#FFFFFF' } }),
  createTheme({ id:'azulMedianoche', name:'Azul Medianoche', description:'Navy con oro', palette:['#0F172A','#1E293B','#D4AF37','#E5E7EB'], tokens:{ pageBg:'#0F172A', sectionBg:'#1F2937', sectionAltBg:'#1E293B', heroBg:'linear-gradient(135deg,#0B1220 0%,#1E293B 100%)', heroOverlay:'rgba(0,0,0,0.35)', heroText:'#FFF7E6', titleText:'#FFF7E6', bodyText:'#E5E7EB', mutedText:'#CBD5E1', accent:'#D4AF37', accentContrast:'#0F172A', surfaceBg:'#1F2937', surfaceText:'#F8FAFC', border:'#334155', buttonBg:'#D4AF37', buttonText:'#0F172A', buttonHoverBg:'#FDE68A', buttonHoverText:'#111827', rsvpBg:'#111827', rsvpText:'#F8FAFC', footerBg:'#020617', footerText:'#E5E7EB' } }),
  createTheme({ id:'ideDark', name:'IDE Dark', description:'Tecnológico y moderno', palette:['#0D1117','#161B22','#58A6FF','#F0F6FC'], tokens:{ pageBg:'#0D1117', sectionBg:'#161B22', sectionAltBg:'#0D1117', heroBg:'linear-gradient(135deg,#0D1117 0%,#161B22 100%)', heroOverlay:'rgba(0,0,0,0.35)', heroText:'#F0F6FC', titleText:'#F0F6FC', bodyText:'#C9D1D9', mutedText:'#8B949E', accent:'#58A6FF', accentContrast:'#0D1117', surfaceBg:'#161B22', surfaceText:'#F0F6FC', border:'#30363D', buttonBg:'#58A6FF', buttonText:'#0D1117', buttonHoverBg:'#79C0FF', buttonHoverText:'#0D1117', rsvpBg:'#161B22', rsvpText:'#F0F6FC', footerBg:'#0D1117', footerText:'#F0F6FC' } }),
];
