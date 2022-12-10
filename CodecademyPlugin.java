package edu.cmu.cs.cs214.analyzer.plugin;

import org.jsoup.Jsoup;
import org.jsoup.nodes.*;
import org.jsoup.select.Elements;

import java.io.IOException;
import java.util.ArrayList;

import edu.cmu.cs.cs214.analyzer.framework.core.Course;
import edu.cmu.cs.cs214.analyzer.framework.core.DataPlugin;

public class CodecademyPlugin implements DataPlugin {
    final private int NUM_COURSES = 30;  /* <= 252 */

    @Override
    public String getName() {
        return "Codecademy";
    }

    @Override
    public ArrayList<Course> getCourses() {
        ArrayList<Course> courses = new ArrayList<>();
        ArrayList<String> urls;
        try {
            urls = retrieveCourseUrls();
        } catch (IOException e) {
            System.out.println("Failed to retrieve course URLs");
            e.printStackTrace(); return courses;
        }
        for (int i = 0; i < NUM_COURSES; i++) {
            try {
                courses.add(retrieveCourse(urls.get(i)));
                System.out.println((i+1) + "/" + NUM_COURSES + " Retrieved course at " + urls.get(i));
            } catch (IOException e) {
                System.out.println("Failed to retrieve course - " + urls.get(i));
            }
        }
        return courses;
    }
    

    private ArrayList<String> retrieveCourseUrls() throws IOException {
        ArrayList<String> urls = new ArrayList<>();
        Document document = Jsoup.connect("https://www.codecademy.com/catalog/all").get();
        Elements listItems = document.select("#catalog-heading + h1 + div").first().lastElementChild().select("ul > li");
        for (Element listItem : listItems) {
            Element link = listItem.firstElementChild();
            urls.add(link.attr("href"));
        }
        return urls;
    }

    private Course retrieveCourse(String url) throws IOException {
        Course course = new Course();

        Document document = Jsoup.connect("https://www.codecademy.com" + url).get();
        course.name = document.select("h1").first().text();
        course.organizationName = "Codecademy";
        course.year = 2022;
        
        course.id = -1;
        course.instructorNames = new ArrayList<>();
        course.instructorNames.add("Codecademy Team");
        course.category = "";
        course.totalWeeks = -1;
        course.estimatedWorkload = -1;
        course.rate = -1;
        course.price = -1;
        course.reviews = new ArrayList<>();

        Elements paragraphs = document.select("p");
        course.description = paragraphs.first().text();

        String belowFirstPar = paragraphs.get(1).nextElementSibling().text();
        if (belowFirstPar.matches(".*[0-9].*")) {
            course.level = "";
            try {
                course.totalStudents = Integer.parseInt(belowFirstPar.replaceAll("[\\D]", ""));
            } catch (Exception e) {
                course.totalStudents = -1;
            }
            try {
                course.totalHours = Integer.parseInt(paragraphs.get(3).text().replaceAll("[\\D]", ""));
            } catch (Exception e) {
                course.totalHours = -1;
            }
        } else {
            course.level = belowFirstPar;
            try {
                course.totalHours = Integer.parseInt(paragraphs.get(2).nextElementSibling().text().replaceAll("[\\D]", ""));
            } catch (Exception e) {
                course.totalHours = -1;
            }
            course.totalStudents = -1;
        }

        return course;
    }
}
