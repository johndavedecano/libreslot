import moment from "moment";

export const createSlotsObject = (min = 25) => {
  const init = moment(`2023-12-01 08:00`);
  let items = [init.format("HH:mm")];
  const slots = {
    [init.format("HH:mm")]: {
      label: init.format("h:mm A"),
      available: min,
      enabled: true,
    },
  };

  Array.from(new Array(20)).map((v, i) => {
    const curr = moment(`2023-12-01 ${items[items.length - 1]}`).add(
      30,
      "minutes"
    );
    slots[curr.format("HH:mm")] = {
      label: curr.format("h:mm A"),
      available: min,
      enabled: true,
    };
    items.push(curr.format("HH:mm"));
  });
  return slots;
};
