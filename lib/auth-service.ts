// This is a mock authentication service
// In a real application, this would connect to a backend API

interface LoginParams {
  email: string
  password: string
  licenseId?: string
  role: "doctor" | "patient"
}

export async function loginUser(params: LoginParams): Promise<void> {
  // Simulate API call
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // For demo purposes, we'll accept any credentials
      // In a real app, this would validate against a backend

      // Store user info in localStorage for client-side auth
      localStorage.setItem(
        "user",
        JSON.stringify({
          email: params.email,
          role: params.role,
          name: params.role === "doctor" ? "Dr. Jane Smith" : "John Doe",
          id: params.role === "doctor" ? "DOC123" : "PAT456",
          licenseId: params.licenseId,
          isAuthenticated: true,
        }),
      )

      resolve()
    }, 1000)
  })
}

export async function logoutUser(): Promise<void> {
  // Clear user data from localStorage
  localStorage.removeItem("user")
  return Promise.resolve()
}

export function getCurrentUser() {
  if (typeof window === "undefined") {
    return null
  }

  const userStr = localStorage.getItem("user")
  if (!userStr) {
    return null
  }

  try {
    return JSON.parse(userStr)
  } catch (e) {
    return null
  }
}

export function isAuthenticated(): boolean {
  const user = getCurrentUser()
  return !!user?.isAuthenticated
}

export function getUserRole(): string | null {
  const user = getCurrentUser()
  return user?.role || null
}
