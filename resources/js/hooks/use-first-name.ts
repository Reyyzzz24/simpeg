export function useFirstName(name: string) {
    return name ? name.split(' ')[0] : 'User';
}