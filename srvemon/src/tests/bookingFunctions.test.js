
import { initializeTimes, timesReducer } from "../Main";
import { fetchAPI } from "../api";

jest.mock("../api");

beforeEach(() => {
  fetchAPI.mockReturnValue(["17:00", "18:00", "19:00", "20:00", "21:00", "22:00"]);
});

test("initializeTimes returns a list of available booking times", () => {
    const result = initializeTimes();
    console.log("initializeTimes result:", result); // Debug log
    expect(result).toEqual(["17:00", "18:00", "19:00", "20:00", "21:00", "22:00"]);
});

test("timesReducer returns the correct time slots for a given date", () => {
    const action = { type: "UPDATE_TIMES", payload: new Date("2024-06-01") };
    const result = timesReducer([], action);
    console.log("Reducer output:", result); // Debug log
    expect(result).toEqual(["17:00", "18:00", "19:00", "20:00", "21:00", "22:00"]);
});
