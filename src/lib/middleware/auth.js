import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export function verifyToken(token) {
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key"
    );
    return { valid: true, decoded };
  } catch (error) {
    return { valid: false, error: error.message };
  }
}

export function authMiddleware(request) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        { message: "Token tidak ditemukan" },
        { status: 401 }
      );
    }

    const { valid, decoded, error } = verifyToken(token);

    if (!valid) {
      return NextResponse.json(
        { message: "Token tidak valid", error },
        { status: 401 }
      );
    }

    // Add user info to request
    request.user = decoded;
    return NextResponse.next();
  } catch (error) {
    return NextResponse.json(
      { message: "Terjadi kesalahan autentikasi" },
      { status: 500 }
    );
  }
}

// Helper function untuk client-side auth check
export function isAuthenticated() {
  if (typeof window === "undefined") return false;

  const token = localStorage.getItem("adminToken");
  if (!token) return false;

  try {
    const decoded = jwt.decode(token);
    if (!decoded) return false;

    // Check if token is expired
    const currentTime = Date.now() / 1000;
    if (decoded.exp < currentTime) {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminUser");
      return false;
    }

    return true;
  } catch (error) {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    return false;
  }
}

// Helper function untuk get user data
export function getCurrentUser() {
  if (typeof window === "undefined") return null;

  try {
    const userStr = localStorage.getItem("adminUser");
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    return null;
  }
}
