package org.basex.query.func.util;

import java.util.*;

import org.basex.query.*;
import org.basex.query.expr.*;
import org.basex.query.func.*;
import org.basex.query.iter.*;
import org.basex.query.value.*;
import org.basex.query.value.array.*;
import org.basex.query.value.item.*;
import org.basex.query.value.type.*;

/**
 * Function implementation.
 *
 * @author BaseX Team 2005-21, BSD License
 * @author Christian Gruen
 */
public final class UtilArrayValues extends StandardFunc {
  @Override
  public Iter iter(final QueryContext qc) throws QueryException {
    final XQArray array = toArray(exprs[0], qc);

    return new Iter() {
      final Iterator<Value> members = array.members().iterator();
      Iter ir;

      @Override
      public Item next() throws QueryException {
        while(true) {
          if(ir != null) {
            final Item item = qc.next(ir);
            if(item != null) return item;
          }
          if(!members.hasNext()) return null;
          ir = members.next().iter();
        }
      }
    };
  }

  @Override
  public Value value(final QueryContext qc) throws QueryException {
    final XQArray array = toArray(exprs[0], qc);

    final ValueBuilder vb = new ValueBuilder(qc);
    for(final Value member : array.members()) vb.add(member);
    return vb.value(this);
  }

  @Override
  protected Expr opt(final CompileContext cc) {
    final FuncType ft = exprs[0].funcType();
    if(ft instanceof ArrayType) exprType.assign(ft.declType.with(Occ.ZERO_OR_MORE));
    return this;
  }
}