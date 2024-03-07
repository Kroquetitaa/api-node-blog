

export interface Posts {
    title: string;
    content: string;
    slug: string;
    published?: boolean;
    created_at: Date;
}

export interface PostsModel extends Posts, Document {}