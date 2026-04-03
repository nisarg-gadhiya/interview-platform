export const deductCredits = async (user, amount) => {
  if (user.credits < amount) {
    throw new Error("Insufficient credits");
  }

  user.credits -= amount;
  await user.save();
};

export const addCredits = async (user, amount) => {
  user.credits += amount;
  await user.save();
};