package innexgo;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Transactional
@Repository
public class LocationService {

  @Autowired private JdbcTemplate jdbcTemplate;

  public Location getById(long id) {
    String sql = "SELECT id, name, tags FROM location WHERE id=?";
    RowMapper<Location> rowMapper = new LocationRowMapper();
    Location location = jdbcTemplate.queryForObject(sql, rowMapper, id);
    return location;
  }

  public List<Location> getAll() {
    String sql = "SELECT id, name, tags FROM location";
    RowMapper<Location> rowMapper = new LocationRowMapper();
    return this.jdbcTemplate.query(sql, rowMapper);
  }

  public void add(Location location) {
    // Add location
    String sql = "INSERT INTO location (id, name, tags) values (?, ?, ?)";
    jdbcTemplate.update(sql, location.id, location.name, location.tags);

    // Fetch location id
    sql = "SELECT id FROM location WHERE name=? AND tags=?";
    long id = jdbcTemplate.queryForObject(sql, Long.class, location.name, location.tags);

    // Set location id
    location.id = id;
  }

  public void update(Location location) {
    String sql = "UPDATE location SET id=?, name=?, tags=? WHERE id=?";
    jdbcTemplate.update(sql, location.id, location.name, location.tags, location.id);
  }

  public Location deleteById(long id) {
    Location location = getById(id);
    String sql = "DELETE FROM location WHERE id=?";
    jdbcTemplate.update(sql, id);
    return location;
  }

  public boolean existsById(long id) {
    String sql = "SELECT count(*) FROM location WHERE id=?";
    int count = jdbcTemplate.queryForObject(sql, Integer.class, id);
    return count != 0;
  }

  public List<Location> query(Long id, String name, String tags) {
    String sql =
        "SELECT l.id, l.name, l.tags FROM location l"
            + " WHERE 1=1 "
            + (id == null ? "" : " AND l.id = " + id)
            + (name == null ? "" : " AND l.name = " + Utils.escape(name))
            + (tags == null ? "" : " AND l.tags = " + Utils.escape(tags))
            + ";";

    RowMapper<Location> rowMapper = new LocationRowMapper();
    return this.jdbcTemplate.query(sql, rowMapper);
  }
}
