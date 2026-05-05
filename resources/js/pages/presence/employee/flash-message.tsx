type Props = {
    success?: string;
    error?: string;
};

export default function FlashMessage({ success, error }: Props) {
    if (!success && !error) {
        return null;
    }

    return (
        <div
            className={`rounded-lg border p-4 text-sm ${
                success
                    ? 'border-green-200 bg-green-50 text-green-700'
                    : 'border-red-200 bg-red-50 text-red-700'
            }`}
        >
            {success ?? error}
        </div>
    );
}
