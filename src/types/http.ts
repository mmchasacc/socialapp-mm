export type RegisterRequest = {
  username: string;
  visibility?: "private" | "public";
  profile_image?: string;
  bio?: string;
  display_name: string;
  email: string;
  phone: string;
  birthdate: string;
  password: string;
};

// DatabaseUser, som är den kompletta användaren som bara finns i databasen eller som admins kan se.

// AuthenticatedUser så som användaren själv ska få när den är inloggad

// PublicUser, vad andra användare kan se om användaren

export type LoginRequest = {
  username: string;
  password: string;
};
