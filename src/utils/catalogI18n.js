export const getCategoryName = (category, language = "es") => {
  if (!category) return "";

  if (language === "en") {
    return category.category_name_english || category.category_name_spanish || category.category_name_french || "";
  }

  if (language === "fr") {
    return category.category_name_french || category.category_name_spanish || category.category_name_english || "";
  }

  return category.category_name_spanish || category.category_name_english || category.category_name_french || "";
};
