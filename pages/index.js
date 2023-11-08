import Index from "layout/Index";

const IndexPage = () => <Index />;

IndexPage.getInitialProps = async () => ({
  namespacesRequired: ["header", "footer", "sidebar", "dashboard"],
});

export default IndexPage;
