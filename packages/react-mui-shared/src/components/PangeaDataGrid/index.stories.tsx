import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import PangeaDataGrid, { PangeaDataGridProps } from "./index";
import { Show, SHOWS } from "../../stories/data/television";

export default {
  title: "PangeaDataGrid",
  component: PangeaDataGrid,
  argTypes: {
    name: {
      type: "string",
    },
  },
} as ComponentMeta<typeof PangeaDataGrid>;

const Template: ComponentStory<typeof PangeaDataGrid> = (args) => (
  <PangeaDataGrid
    {...args}
    ExpansionRow={{
      render: (object: any, open: boolean) => {
        if (!open) return null;

        return (
          <div style={{ padding: "16px" }}>
            {object.description || "No description"}
          </div>
        );
      },
    }}
  />
);

export const SimpleDataGrid: {
  args: PangeaDataGridProps<Show>;
} = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

SimpleDataGrid.args = {
  columns: [
    {
      field: "title",
    },
    {
      field: "description",
      flex: 10,
    },
  ],
  data: SHOWS,
};

export const FilterableDataGrid: {
  args: PangeaDataGridProps<Show>;
} = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

FilterableDataGrid.args = {
  columns: [
    {
      field: "title",
    },
    {
      field: "description",
    },
  ],
  data: SHOWS,
};
