import { render, screen, fireEvent } from "@testing-library/react";
import BookingForm from "../components/BookingForm";

// ✅ Step 1: Test HTML5 Validation Attributes
test("Check if date input has required attribute", () => {
  render(<BookingForm availableTimes={[]} dispatch={() => {}} submitForm={() => {}} />);
  const dateInput = screen.getByLabelText(/choose date/i);
  expect(dateInput).toHaveAttribute("required");
});

test("Check if time select has required attribute", () => {
  render(<BookingForm availableTimes={[]} dispatch={() => {}} submitForm={() => {}} />);
  const timeSelect = screen.getByLabelText(/choose time/i);
  expect(timeSelect).toHaveAttribute("required");
});

test("Check if guests input has min and max attributes", () => {
  render(<BookingForm availableTimes={[]} dispatch={() => {}} submitForm={() => {}} />);
  const guestsInput = screen.getByLabelText(/number of guests/i);
  expect(guestsInput).toHaveAttribute("min", "1");
  expect(guestsInput).toHaveAttribute("max", "10");
});


// ✅ Step 2: JavaScript Form Validation Tests
test("Validate form detects missing date", () => {
  render(<BookingForm availableTimes={[]} dispatch={() => {}} submitForm={() => {}} />);
  
  const submitButton = screen.getByRole("button", { name: /make your reservation/i });
  
  // Try submitting without a date
  fireEvent.click(submitButton);
  
  const errorMessage = screen.getByText(/date is required/i);
  expect(errorMessage).toBeInTheDocument();
});

test("Validate form detects missing time", () => {
  render(<BookingForm availableTimes={[]} dispatch={() => {}} submitForm={() => {}} />);
  
  const submitButton = screen.getByRole("button", { name: /make your reservation/i });

  fireEvent.click(submitButton);
  
  const errorMessage = screen.getByText(/time is required/i);
  expect(errorMessage).toBeInTheDocument();
});

test("Validate form detects out-of-range guests", () => {
  render(<BookingForm availableTimes={[]} dispatch={() => {}} submitForm={() => {}} />);
  
  const guestsInput = screen.getByLabelText(/number of guests/i);
  fireEvent.change(guestsInput, { target: { value: "12" } });

  const submitButton = screen.getByRole("button", { name: /make your reservation/i });
  fireEvent.click(submitButton);

  const errorMessage = screen.getByText(/guests must be between 1 and 10/i);
  expect(errorMessage).toBeInTheDocument();
});

test("Form submits successfully when all fields are valid", () => {
  const mockSubmitForm = jest.fn(); // Mock function for submit
  
  render(<BookingForm availableTimes={["18:00"]} dispatch={() => {}} submitForm={mockSubmitForm} />);
  
  fireEvent.change(screen.getByLabelText(/choose date/i), { target: { value: "2025-03-14" } });
  fireEvent.change(screen.getByLabelText(/choose time/i), { target: { value: "18:00" } });
  fireEvent.change(screen.getByLabelText(/number of guests/i), { target: { value: "4" } });

  const submitButton = screen.getByRole("button", { name: /make your reservation/i });
  fireEvent.click(submitButton);

  expect(mockSubmitForm).toHaveBeenCalledTimes(1);
});
