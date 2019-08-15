export default class Component {
	constructor (props) {
		this.props = props;
	}

	render () {
		let $div = document.createElement("div");
		$div.innerHTML = "123";
		return $div;
	}

	createElement () {
		const content = this.render();
		const $div = document.createElement("div");
		$div.innerHTML = content;
		return $div;
	}
}