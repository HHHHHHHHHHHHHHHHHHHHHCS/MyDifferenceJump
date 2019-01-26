export enum StorageEnum {
	BGMVolume,
	AudioEffectVolume,
	NormalHighScore,
	NightmareHighScore,
}

/** 储存数据 */
export default class MyStorageManager {

	/** 储存数据 */
	public static Save(type: StorageEnum, val: any) {
		cc.sys.localStorage.setItem(StorageEnum[type], val.toString());
	}

	/** 读取数据 */
	public static GetString(type: StorageEnum): string {
		return cc.sys.localStorage.getItem(StorageEnum[type]);
	}

	/** 读取数据 */
	public static GetInt(type: StorageEnum): number {
		var value = Number.parseInt(MyStorageManager.GetString(type));
		if (isNaN(value)) {
			value = 0;
		}
		return value;
	}

	/** 读取数据 */
	public static GetFloat(type: StorageEnum): number {
		var value = Number.parseFloat(MyStorageManager.GetString(type));
		if (isNaN(value)) {
			value = 0;
		}
		return value;
	}

	/** 读取数据 */
	public static GetBoolean(type: StorageEnum): boolean {
		return MyStorageManager.GetString(type) == "true";
	}
}