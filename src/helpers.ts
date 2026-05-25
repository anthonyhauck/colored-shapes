import OBR, { isShape, isPath, Item, Image, buildShape, buildPath, Command } from "@owlbear-rodeo/sdk";
import { getPluginId } from "./getPluginId";

export function isPlainObject(
  item: unknown
): item is Record<keyof any, unknown> {
  return (
    item !== null && typeof item === "object" && item.constructor === Object
  );
}

/** Update the selected state of the color buttons */
export async function updateColorButtons(items: Item[]) {
  const selection = await OBR.player.getSelection();
  // Remove all previous selected states
  document.querySelectorAll(".color-button").forEach((element) => {
    element.classList.remove("selected");
  });
  // Get all the status rings that are attached to our current selection
  for (const item of items) {
    const metadata = item.metadata[getPluginId("metadata")];
    if (
      isPlainObject(metadata) &&
      metadata.enabled &&
      (isShape(item) || isPath(item)) &&
      item.attachedTo &&
      selection?.includes(item.attachedTo)
    ) {
      // Add selected state to this rings color
      const color = item.style.strokeColor;
      document.getElementById(color)?.classList.add("selected");
    }
  }
}

/**
 * Helper to build a circle shape with the proper size to match
 * the input image's size
 */
export function buildStatusRing(
  item: Image,
  color: string,
  dpi: number,
  scale: number,
  shapeType: "CIRCLE" | "RECTANGLE" = "CIRCLE"
) {
  const dpiScale = dpi / item.grid.dpi;
  const width = item.image.width * dpiScale;
  const height = item.image.height * dpiScale;
  const diameter = Math.min(width, height);
  const offsetX = (item.grid.offset.x / item.image.width) * width;
  const offsetY = (item.grid.offset.y / item.image.height) * height;
  // Apply image offset and offset circle position so the origin is the top left
  const position = {
    x: item.position.x - offsetX + width / 2,
    y: item.position.y - offsetY + height / 2,
  };

  if (shapeType === "RECTANGLE") {
    const r = diameter / 2;
    return buildPath()
      .commands([
        [Command.MOVE, -r + 10, r],
        [Command.LINE, -r, r],
        [Command.LINE, -r, -r],
        [Command.LINE, r, -r],
        [Command.LINE, r, r],
        [Command.LINE, r - 10, r],
      ])
      .scale({ x: scale, y: scale })
      .position(position)
      .fillOpacity(0)
      .strokeColor(color)
      .strokeOpacity(1)
      .strokeWidth(5)
      .attachedTo(item.id)
      .locked(true)
      .name("Status Shape")
      .metadata({ [getPluginId("metadata")]: { enabled: true } })
      .layer("ATTACHMENT")
      .disableHit(true)
      .visible(item.visible)
      .build();
  }

  return buildShape()
    .width(diameter)
    .height(diameter)
    .scale({ x: scale, y: scale })
    .position(position)
    .fillOpacity(0)
    .strokeColor(color)
    .strokeOpacity(1)
    .strokeWidth(5)
    .shapeType("CIRCLE")
    .attachedTo(item.id)
    .locked(true)
    .name("Status Ring")
    .metadata({ [getPluginId("metadata")]: { enabled: true } })
    .layer("ATTACHMENT")
    .disableHit(true)
    .visible(item.visible)
    .build();
}

/** Update the status rings for the current selection so that there are no gaps */
export function updateStatusRingScales(selectedItems: Item[]) {
  const selection = selectedItems.map((item) => item.id);
  return OBR.scene.items.updateItems(
    (item) => {
      const metadata = item.metadata[getPluginId("metadata")];
      return Boolean(
        isPlainObject(metadata) &&
          metadata.enabled &&
          item.attachedTo &&
          selection.includes(item.attachedTo)
      );
    },
    (items) => {
      for (const item of selectedItems) {
        const attached = items.filter((i) => i.attachedTo === item.id);
        for (let i = 0; i < attached.length; i++) {
          const scale = item.scale.x * (1 - i * 0.1);
          attached[i].scale = { x: scale, y: scale };
        }
      }
    }
  );
}
