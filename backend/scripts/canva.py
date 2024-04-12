import sys
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

if len(sys.argv) < 2:
    print("Usage: python script_name.py <template_title>")
    sys.exit(1)

# Extract template title from command-line argument
Template = sys.argv[1]

# Initialize Chrome WebDriver
service = Service(executable_path="chromedriver.exe")
driver = webdriver.Chrome(service=service)

# Navigate to Canva website
driver.get("https://www.canva.com/")

# Find and input the template search query
search_input = WebDriverWait(driver, 10).until(
    EC.visibility_of_element_located((By.CSS_SELECTOR, 'input[data-testid="search-input"]'))
)
search_input.send_keys(Template)
search_input.send_keys(Keys.RETURN)

# Wait for search results to load
WebDriverWait(driver, 10).until(EC.visibility_of_element_located((By.CSS_SELECTOR, '.design-element-thumb')))

# Quit the driver
driver.quit()
