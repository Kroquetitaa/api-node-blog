export interface Categories {
    title: string;
    slug: string;
    published?: boolean;
  }
  
export interface CategoriesModel extends Categories, Document {}
  