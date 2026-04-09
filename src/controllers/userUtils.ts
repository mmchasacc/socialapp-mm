// Exempel på hur vi mappar databasanvändare till en publik form.

const mapToPublic(user: DatabaseUser): PublicUser {
    return {
        username: user.username,
        display_name: user.display_name
    }
}