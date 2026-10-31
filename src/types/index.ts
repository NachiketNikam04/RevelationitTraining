export interface NavItem {
  label: string;
  href: string;
  isExternal?: boolean;
}

export interface FloatingAvatar {
  id: string;
  name: string;
  role: string;
  image: string;
  bgColor: string;
  position: {
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
  };
  shape: string;
  delay: number;
}

export interface FeatureCard {
  id: string;
  title: string;
  description?: string;
}

export interface PartnerLogo {
  name: string;
  svgPath?: string;
}
