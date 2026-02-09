export function extractFileName(url: string): string {
	const parts = url.split("/");
	const fileName = parts[parts.length - 1];
	if (!fileName || fileName.trim() === "" || !fileName.includes(".")) {
		throw new Error(`Unable to extract filename from URL: ${url}`);
	}
	return fileName;
}
