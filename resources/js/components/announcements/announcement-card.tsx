export const AnnouncementCard = ({ announcement, className }: any) => (
    <div className={`p-4 border rounded-lg ${className}`}>
        <h3 className="font-bold">{announcement.title}</h3>
        <p>{announcement.content}</p>
    </div>
);