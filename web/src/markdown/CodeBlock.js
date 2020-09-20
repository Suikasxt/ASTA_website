import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import { coy } from "react-syntax-highlighter/dist/esm/styles/prism";
import { jsx, javascript, sass, scss, python, c, bash } from "react-syntax-highlighter/dist/esm/languages/prism";

class CodeBlock extends PureComponent {
	static propTypes = {
		value: PropTypes.string.isRequired,
		language: PropTypes.string
	};

	static defaultProps = {
		language: null
	};

	componentWillMount() {
		SyntaxHighlighter.registerLanguage("jsx", jsx);
		SyntaxHighlighter.registerLanguage("javascript", javascript);
		SyntaxHighlighter.registerLanguage("python", python);
		SyntaxHighlighter.registerLanguage("c", c);
		SyntaxHighlighter.registerLanguage("bash", bash);
	}

	render() {
		const { language, value } = this.props;
		return (
			<figure className="highlight">
				<SyntaxHighlighter language={language} style={coy}>
					{value}
				</SyntaxHighlighter>
			</figure>
		);
	}
}

export default CodeBlock;