/** Unity魔改 */
export default class MyU {
	/**
	 * Log用
	 */
	public static Log(...msgs: any) {
		console.log(...msgs);
	}

	/**
	 * 如果rd<0.5,则返回lowHalf,否则返回highHalf
	 */
	public static RandomNumber(lowHalf: number, highHalf: number): number {
		return Math.random() < 0.5 ? lowHalf : highHalf;

	}

	/**
	 * 随机01
	 */
	public static Random01(): number {
		return Math.random();
	}

	/**
	 * 随机区间float
	 */
	public static Random(min: number, max: number): number {
		if (min == 0) {
			return Math.random() * max;
		}
		return Math.random() * (max - min) + min;
	}

	/**
	 * 随机区间Int
	 */
	public static RandomInt(min: number, max: number): number {
		return Math.floor(Math.random() * (max - min + 1) + min);
	}
}