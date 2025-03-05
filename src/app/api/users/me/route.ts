import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";

// Mock in-memory user store - in a real app this would be a database
// This is just for demonstration purposes to show profile updates persisting
let mockUsers = new Map<string, any>([
  ["user-1", {
    id: "user-1",
    name: "Demo User",
    email: "demo@example.com",
    organizationId: "org-1",
    organizationName: "Demo Organization",
    role: "ADMIN"
  }]
]);

console.log("Initial mockUsers state:", JSON.stringify(Array.from(mockUsers.entries())));

// Get the user from the token in cookies
function getUserFromRequest(req: NextRequest) {
  // Get the token from cookies or authorization header
  const cookieStore = cookies();
  const token = cookieStore.get("financeAppToken")?.value || 
    req.headers.get("authorization")?.replace("Bearer ", "");
  
  if (!token) {
    console.log("No token found in request");
    return null;
  }
  
  try {
    // Decode the token
    const decoded = jwtDecode<{sub: string}>(token);
    const userId = decoded.sub;
    
    console.log(`Token decoded, userId: ${userId}`);
    console.log(`Current mockUsers state:`, JSON.stringify(Array.from(mockUsers.entries())));
    
    // In a real app, you would fetch the user from your database
    const user = mockUsers.get(userId);
    console.log(`User from mockUsers:`, user);
    return user || null;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
}

// GET /api/users/me - Get current user profile
export async function GET(req: NextRequest) {
  console.log("GET /api/users/me - Request received");
  const user = getUserFromRequest(req);
  
  if (!user) {
    console.log("GET /api/users/me - Unauthorized: No user found");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  console.log("GET /api/users/me - Returning user:", user);
  
  return NextResponse.json({ user });
}

// PUT /api/users/me - Update current user profile
export async function PUT(req: NextRequest) {
  console.log("PUT /api/users/me - Request received");
  console.log("Current mockUsers state before update:", JSON.stringify(Array.from(mockUsers.entries())));
  
  const user = getUserFromRequest(req);
  
  if (!user) {
    console.log("PUT /api/users/me - Unauthorized: No user found");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  try {
    // Get the update data from the request body
    const updateData = await req.json();
    console.log("PUT /api/users/me - Update request data:", updateData);
    
    // Update the user data
    const updatedUser = {
      ...user,
      ...updateData,
      // Always keep certain fields
      id: user.id, // Don't allow changing the ID
      organizationId: user.organizationId, // Don't allow changing org ID
      role: user.role, // Don't allow changing role via profile update
    };
    
    console.log("PUT /api/users/me - User before update:", user);
    console.log("PUT /api/users/me - Updated user (to be saved):", updatedUser);
    
    // In a real app, this would update the database
    mockUsers.set(user.id, updatedUser);
    
    console.log("PUT /api/users/me - mockUsers state after update:", JSON.stringify(Array.from(mockUsers.entries())));
    console.log("PUT /api/users/me - Verification: user from updated mockUsers:", mockUsers.get(user.id));
    
    const response = { 
      user: updatedUser,
      message: "Profile updated successfully" 
    };
    
    console.log("PUT /api/users/me - Sending response:", response);
    
    return NextResponse.json(response);
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json({ 
      error: "Failed to update profile" 
    }, { 
      status: 500 
    });
  }
} 