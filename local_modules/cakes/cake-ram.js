class RAM{
	constructor(){
		this.obj = {_id:{},data:{}};
		this.length = 0;
	}
	add(key, value){
		this.obj.data[key] = value;
		this.obj._id[this.length] = key;
		this.length++;
	}
	remove(key){
	}
	updateByKey(key, update){
		this.obj[key] = update;
	}
	updateByIndex(i, update){
		let key = this.indexing[i];
		this.obj[key] = update;
	}
	getByIndex(i){
		let key = this.indexing[i];
		return this.obj[key];
	}
	getByKey(key){
		return this.obj[key];
	}
	getAll(){
		return this.obj;
	}
	keys(){
		return Object.values(this.obj._id);
	}
	values(){
		return Object.values(this.obj.data);
	}
	each(fn){
		let arr = [];
		for (let i = 0; i < this.length; i++){
			let key = this.obj._id[i];
			let t = fn(key, this.obj.data[key]);
			if (!t && t != undefined) break;
		}
	}
}