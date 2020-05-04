package org.aprestos.labs.apiclient;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public final class Ident {

  private static final Logger LOGGER = LoggerFactory.getLogger(Ident.class);

  private final String stringValue;

  private Long longValue;
  
  
  public static Ident create(String ident) {
    return new Ident(ident);
  }

  public static Ident create(Long ident) {
    return new Ident(ident);
  }

  private Ident(Long ident) {
    longValue = ident;
    stringValue = Long.toString(ident);
  }

  private Ident(String ident) {
    stringValue = ident;

    try {
      longValue = Long.parseLong(ident);
    } catch (NumberFormatException e) {
      LOGGER.warn("could not convert to long: {}", ident);
    }
  }

  public boolean isString() {
    return null != stringValue;
  }

  public boolean isLong() {
    return null != longValue;
  }

  public String asString() {
    return stringValue;
  }

  public Long asLong() {
    return longValue;
  }

  @Override
  public String toString() {
    return stringValue;
  }

  @Override
  public int hashCode() {
    final int prime = 31;
    
    int result = prime * 1 + ((longValue == null) ? 0 : longValue.hashCode());
    result = prime * result + ((stringValue == null) ? 0 : stringValue.hashCode());
    return result;
  }

  @Override
  public boolean equals(Object obj) {
    if (this == obj)
      return true;
    if (obj == null)
      return false;
    if (getClass() != obj.getClass())
      return false;
    Ident other = (Ident) obj;
    if (longValue == null) {
      if (other.longValue != null)
        return false;
    } else if (!longValue.equals(other.longValue))
      return false;
    if (stringValue == null) {
      if (other.stringValue != null)
        return false;
    } else if (!stringValue.equals(other.stringValue))
      return false;
    return true;
  }

}
