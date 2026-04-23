import { ViewerFrame } from "./ViewerFrame";

type ImageContentProps = {
	value: string;
};

export function ImageContent({ value }: ImageContentProps) {
	return (
		<ViewerFrame
			type="image"
			rendered={
				<div className="p-4">
					<img
						src={value}
						alt="visualization"
						className="max-w-full rounded-md"
					/>
				</div>
			}
			rawText={value}
			copyText={value}
			sizeLabel="image"
			rawLanguage="text"
		/>
	);
}
