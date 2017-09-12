---------------
-- SQL Tasks --
---------------

--
-- 1. Get all statuses, not repeating, alphabetically ordered
--

SELECT DISTINCT `status` FROM `tasks` ORDER BY `status`;

--
-- 2. Get the count of all tasks in each project, order by tasks count descending
--

SELECT project.name AS project_name,
  (SELECT COUNT(*) FROM tasks WHERE project_id=project.id) AS tasks_count
  FROM projects as project ORDER BY tasks_count DESC;

--
-- 3. Get the count of all tasks in each project, order by projects names
--

SELECT project.name AS project_name,
  (SELECT COUNT(*) FROM tasks WHERE project_id=project.id) AS tasks_count
  FROM projects as project ORDER BY project_name ASC;

--
-- 4. Get the tasks for all projects having the name beginning with “N” letter
--

SELECT name FROM tasks WHERE name LIKE "N%";

--
-- 5. Get the list of all projects containing the ‘a’ letter in the middle of the name, and
--    show the tasks count near each project. Mention that there can exist projects without
--    tasks and tasks with project_id=NULL

SELECT
  project.name AS project_name,
  (SELECT COUNT(*) FROM tasks WHERE project_id=project.id) AS tasks_count
    FROM projects AS project WHERE name LIKE "%n%";

--
-- 6. Get the list of tasks with duplicate names. Order alphabetically
--

SELECT task.name AS task_name
  FROM tasks AS task
  GROUP BY task.name
  HAVING count(*)>1
  ORDER BY task.name
  ASC;

--
-- 7. Get the list of tasks having several exact matches of both name and status, from
--    the project ‘Garage’. Order by matches count
--

SELECT
  task.name AS task_name,
  COUNT(*) AS matches_count
    FROM tasks AS task
    WHERE name=status AND project_id=(SELECT id FROM projects WHERE name='Garage')
    GROUP BY name
    HAVING matches_count > 1
    ORDER BY matches_count;

--
-- 8. Get the list of project names having more than 10 tasks in status ‘completed’. Order
--    by project_id
--

SELECT project.name AS project_name
  FROM projects AS project
  WHERE id IN
    (SELECT project_id
      FROM tasks
      WHERE status='completed'
      GROUP BY project_id
      HAVING count(*)>10
      ORDER BY project_id
    );