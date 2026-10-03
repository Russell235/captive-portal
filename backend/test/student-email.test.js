const test = require("node:test");
const assert = require("node:assert/strict");

const {
  buildStudentPasswordEmail,
} = require("../utils/sendStudentPasswordEmail");

test("buildStudentPasswordEmail includes the generated password and recipient details", () => {
  const email = buildStudentPasswordEmail({
    fullName: "Alice Student",
    email: "alice@student.example",
    password: "Abc123!x",
  });

  assert.equal(email.to, "alice@student.example");
  assert.match(email.subject, /temporary password|account credentials/i);
  assert.match(email.text, /Alice Student/i);
  assert.match(email.text, /Abc123!x/);
});
