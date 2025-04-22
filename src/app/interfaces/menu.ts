export interface MenuItem {
  id: number;
  route?: string; // Optional because not all items have a route
  title: string;
  description?: string; // Optional description for the menu item
  images?: string[]; // Array of image URLs
  slug?: string; // Unique URL-friendly identifier for the menu item
  children?: MenuItem[]; // Optional because not all items have children
}

export interface MenuStructure {
  items: MenuItem[];
}

export interface MenuResponse {
  id: number;
  menuStructure: MenuStructure;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MenuOptionRequest {
  parentId: number;
  title: string;
  description?: string; // Optional description
  route?: string;
  images?: string[]; // Array of image URLs
  slug?: string; // Unique URL-friendly identifier
}
