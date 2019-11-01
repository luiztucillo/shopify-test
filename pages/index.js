import { EmptyState, Layout, Page } from "@shopify/polaris";
import { ResourcePicker, TitleBar } from "@shopify/app-bridge-react";
import store from "store-js";
import ResourceListWithProducts from "../components/ResourceList";

const img = "https://cdn.shopify.com/s/files/1/0757/9955/files/empty-state.svg";

class Index extends React.Component {
  state = { open: false };

  handleSelection = resources => {
    const idsFromResources = resources.selection.map(product => product.id);
    this.setState({ open: false });
    console.log(resources);
    store.set("ids", idsFromResources);
  };

  layout() {
    return (
      <Layout>
        <EmptyState
          heading="Select products to start"
          action={{
            content: "Select products",
            onAction: () => this.setState({ open: true })
          }}
          image={img}
        >
          <p>Select products and change their price temporarily</p>
        </EmptyState>
      </Layout>
    );
  }

  render() {
    const emptyState = !store.get("ids");
    return (
      <Page>
        <TitleBar
          primaryAction={{
            content: "Select Products",
            onAction: () => {
              this.setState({ open: true });
            }
          }}
        ></TitleBar>
        <ResourcePicker
          resourceType="Product"
          showVariants={false}
          open={this.state.open}
          onSelection={resources => this.handleSelection(resources)}
          onCancel={() => this.setState({ open: false })}
        />
        {emptyState ? this.layout() : <ResourceListWithProducts />}
      </Page>
    );
  }
}

export default Index;
