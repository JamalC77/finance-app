"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal,
  ExternalLink,
  Edit,
  Trash2,
  FolderTree
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useApi } from '@/lib/contexts/ApiContext';

// Define category type that works with both mock data and API data
interface Category {
  id: string;
  name: string;
  description?: string;
  color: string;
  type: string;
  parentId?: string;
  organizationId: string;
  children?: Category[];
}

export default function CategoriesPage() {
  // State for categories data
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'hierarchy'>('list');
  
  // Get API context
  const api = useApi();
  
  // Fetch categories data from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        
        // Fetch categories based on view mode
        const endpoint = viewMode === 'hierarchy' ? '/api/categories/hierarchy' : '/api/categories';
        const data = await api.get<Category[]>(endpoint);
        
        setCategories(data);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError(err as Error);
        // No longer falling back to mock data
        setCategories([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCategories();
  }, [api, viewMode]);
  
  // Filter categories based on search query
  const filteredCategories = categories.filter(category => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      category.name.toLowerCase().includes(query) ||
      (category.description && category.description.toLowerCase().includes(query))
    );
  });
  
  // Render a category item
  const renderCategoryItem = (category: Category) => (
    <tr key={category.id} className="border-b border-gray-100">
      <td className="py-3 px-4">
        <div className="flex items-center gap-3">
          <div 
            className="w-4 h-4 rounded-full" 
            style={{ backgroundColor: category.color || '#CCCCCC' }}
          />
          <div className="font-medium">{category.name}</div>
        </div>
      </td>
      <td className="py-3 px-4">{category.description || '-'}</td>
      <td className="py-3 px-4">
        <span className="capitalize">{category.type.toLowerCase()}</span>
      </td>
      <td className="py-3 px-4 text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Link href={`/dashboard/categories/${category.id}`} className="flex items-center">
                <ExternalLink className="mr-2 h-4 w-4" />
                <span>View Details</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href={`/dashboard/categories/${category.id}/edit`} className="flex items-center">
                <Edit className="mr-2 h-4 w-4" />
                <span>Edit Category</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Delete Category</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  );
  
  // Render category hierarchy
  const renderCategoryHierarchy = (categories: Category[], level = 0) => {
    return categories.map(category => (
      <React.Fragment key={category.id}>
        <tr className="border-b border-gray-100">
          <td className="py-3 px-4">
            <div className="flex items-center gap-3">
              <div style={{ marginLeft: `${level * 20}px` }} className="flex items-center gap-2">
                {category.children && category.children.length > 0 && (
                  <FolderTree className="h-4 w-4 text-muted-foreground" />
                )}
                <div 
                  className="w-4 h-4 rounded-full" 
                  style={{ backgroundColor: category.color || '#CCCCCC' }}
                />
                <div className="font-medium">{category.name}</div>
              </div>
            </div>
          </td>
          <td className="py-3 px-4">{category.description || '-'}</td>
          <td className="py-3 px-4">
            <span className="capitalize">{category.type.toLowerCase()}</span>
          </td>
          <td className="py-3 px-4 text-right">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Link href={`/dashboard/categories/${category.id}`} className="flex items-center">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    <span>View Details</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href={`/dashboard/categories/${category.id}/edit`} className="flex items-center">
                    <Edit className="mr-2 h-4 w-4" />
                    <span>Edit Category</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Trash2 className="mr-2 h-4 w-4" />
                  <span>Delete Category</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </td>
        </tr>
        {category.children && category.children.length > 0 && 
          renderCategoryHierarchy(category.children, level + 1)
        }
      </React.Fragment>
    ));
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Categories</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>All Categories</CardTitle>
          <CardDescription>Manage your transaction categories</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search categories..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button 
                variant={viewMode === 'list' ? 'default' : 'outline'} 
                size="sm" 
                onClick={() => setViewMode('list')}
              >
                List
              </Button>
              <Button 
                variant={viewMode === 'hierarchy' ? 'default' : 'outline'} 
                size="sm" 
                onClick={() => setViewMode('hierarchy')}
              >
                Hierarchy
              </Button>
            </div>
          </div>
          
          <div className="rounded-md border">
            <div className="relative w-full overflow-auto">
              <table className="w-full caption-bottom text-sm">
                <thead className="border-b bg-muted/50">
                  <tr>
                    <th className="h-12 px-4 text-left font-medium">Name</th>
                    <th className="h-12 px-4 text-left font-medium">Description</th>
                    <th className="h-12 px-4 text-left font-medium">Type</th>
                    <th className="h-12 px-4 text-left font-medium"></th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={4} className="h-24 text-center">
                        <div className="flex justify-center items-center">Loading categories...</div>
                      </td>
                    </tr>
                  ) : filteredCategories.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="h-24 text-center">
                        No categories found. Try adjusting your filters or create a new category.
                      </td>
                    </tr>
                  ) : viewMode === 'list' ? (
                    filteredCategories.map(renderCategoryItem)
                  ) : (
                    renderCategoryHierarchy(filteredCategories)
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 