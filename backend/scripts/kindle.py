from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
import time

# Path to your ChromeDriver executable
service = Service(executable_path="chromedriver.exe")
driver = webdriver.Chrome(service=service)

# Asking for user input
Title = input("Enter book title: ")
Subtitle = input("Enter Subtitle: ")
Edition = input("Enter Edition: ")
firstName = input("Enter first name: ")
lastName = input("Enter last name: ")

# Navigating to the Amazon KDP page
driver.get("https://kdp.amazon.com/en_US/title-setup/kindle/new/details?ref_=cr_ti")

# Locating input elements and sending keys
driver.find_element(By.ID, "title").send_keys(Title)
driver.find_element(By.ID, "subtitle").send_keys(Subtitle)
driver.find_element(By.ID, "editionNumber").send_keys(Edition)
driver.find_element(By.ID, "author").send_keys(firstName + " " + lastName)

# Waiting for the page to load
time.sleep(10)

# Quitting the driver
driver.quit()
