import "@testing-library/jest-dom/extend-expect";
import { act, render, screen, waitFor } from "@testing-library/react";
import { Tooltip } from "./Tooltip";
import userEvent from "@testing-library/user-event";

import failOnConsole from "jest-fail-on-console";

failOnConsole();


// eslint-disable-next-line testing-library/no-unnecessary-act
const waitForFloating = () => act(async () => {});

describe("Tooltip", () => {
  it("should show tooltip", async () => {
    render(
      <Tooltip text="tooltip">
        <div>foo</div>
      </Tooltip>
    );
    await waitForFloating();


    const fooEl = screen.getByText("foo");

    expect(screen.queryByText("tooltip")).not.toBeInTheDocument();
    
    // eslint-disable-next-line testing-library/no-unnecessary-act
    await act(async () => {
      await userEvent.hover(fooEl);
    
    })
    
 
    await waitForFloating();

    await waitFor(() => {
      expect(screen.getByText("tooltip")).toBeInTheDocument();
    });

    // eslint-disable-next-line testing-library/no-unnecessary-act
    await act(async() => {
      userEvent.unhover(fooEl);
    })

    await waitForFloating();

    await waitFor(() => {
      expect(screen.queryByText("tooltip")).not.toBeInTheDocument();
    });
    await waitForFloating();
  });
});
