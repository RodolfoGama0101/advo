package dev.rodolfo.advo.shared.domain;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class EntityTest {

    private static class TestEntity extends Entity<Long> {
        public TestEntity(Long id) {
            this.id = id;
        }
    }

    private static class AnotherTestEntity extends Entity<Long> {
        public AnotherTestEntity(Long id) {
            this.id = id;
        }
    }

    @Test
    void equals_SameInstance_ReturnsTrue() {
        TestEntity entity = new TestEntity(1L);
        assertEquals(entity, entity);
    }

    @Test
    void equals_SameId_SameClass_ReturnsTrue() {
        TestEntity entity1 = new TestEntity(1L);
        TestEntity entity2 = new TestEntity(1L);
        assertEquals(entity1, entity2);
    }

    @Test
    void equals_DifferentId_SameClass_ReturnsFalse() {
        TestEntity entity1 = new TestEntity(1L);
        TestEntity entity2 = new TestEntity(2L);
        assertNotEquals(entity1, entity2);
    }

    @Test
    void equals_SameId_DifferentClass_ReturnsFalse() {
        TestEntity entity1 = new TestEntity(1L);
        AnotherTestEntity entity2 = new AnotherTestEntity(1L);
        assertNotEquals(entity1, entity2);
    }

    @Test
    void equals_NullId_ReturnsFalse() {
        TestEntity entity1 = new TestEntity(null);
        TestEntity entity2 = new TestEntity(null);
        assertNotEquals(entity1, entity2);
    }

    @Test
    void hashCode_SameId_ReturnsSameHashCode() {
        TestEntity entity1 = new TestEntity(1L);
        TestEntity entity2 = new TestEntity(1L);
        assertEquals(entity1.hashCode(), entity2.hashCode());
    }
}
