export function pythonModuleToFilePath(module: string): string {
	return `${module.replace(/\./g, "/")}.py`;
}

export function filePathToFileName(filePath: string): string {
	// Strip the directory prefix (everything up to the last "/"), then the file extension.
	return filePath.replace(/^.*\//, "").replace(/\.[^./]+$/, "");
}
