import styled from "styled-components";
import { grid } from "../logic/Design";

export const Inline = styled.div({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  gap: grid(0, 1),
  flexWrap: "wrap",
});
